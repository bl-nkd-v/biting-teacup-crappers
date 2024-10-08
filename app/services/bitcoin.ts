import dotenv from "dotenv";
import Client from "bitcoin-core";

import { EventEmitter } from "events";
import prisma from "./database";

dotenv.config();

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

type Block = {
  time: number;
  tx: Array<{
    vout: Array<{
      value: number;
    }>;
  }>;
};

const client = new Client({
  network: "mainnet",
  host: process.env.BITCOIN_RPC_HOST || "",
  port: Number(process.env.BITCOIN_RPC_PORT) || 443,
  username: process.env.BITCOIN_RPC_USER || "",
  password: process.env.BITCOIN_RPC_PASS || "",
  timeout: 60000,
  ssl: {
    enabled: true,
    strict: process.env.ENV !== "development",
  },
});
let lastKnownBlock: string | null = null;

const blockEmitter = new EventEmitter();

const getBlockTime = (block: Partial<Block>): number => {
  return block.time || Date.now();
};

const getLatestBlockReward = (block: Partial<Block>): number => {
  try {
    const coinbaseTx = block.tx?.[0];

    const blockReward =
      coinbaseTx?.vout?.reduce(
        (sum: number, output: { value: number }) => sum + output.value,
        0
      ) ?? 0;

    return blockReward;
  } catch (error) {
    console.error("Error fetching block reward:", error);
    return 0;
  }
};

const createBlock = async (
  blockhash: string,
  height: number,
  block: Partial<Block>
) => {
  const existingBlock = await prisma.bitcoinBlock.findUnique({
    where: { id: blockhash },
  });

  if (existingBlock) {
    console.log(`Block with id ${blockhash} already exists, skipping`);
    return;
  }

  const blockReward = getLatestBlockReward(block);
  blockEmitter.emit("newBlock", blockReward);
  console.log(`New block detected, rewards: ${blockReward}`);
  const blockTime = getBlockTime(block);
  await prisma.bitcoinBlock.create({
    data: {
      id: blockhash,
      height,
      timestamp: new Date(blockTime * 1000),
      reward: blockReward,
    },
  });
};

const watchForNewBlocks = async () => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const blockchainInfo = await client.getBlockchainInfo();
      const currentBlockHash = blockchainInfo.bestblockhash;
      if (lastKnownBlock === null) {
        lastKnownBlock = currentBlockHash;
      }
      if (lastKnownBlock !== currentBlockHash) {
        lastKnownBlock = currentBlockHash;

        const latestBlockHash = await client.getBlockHash(
          blockchainInfo.blocks
        );
        const block = await client.getBlock(latestBlockHash, 2);
        await createBlock(latestBlockHash, blockchainInfo.blocks, block);
      }
      break;
    } catch (error) {
      console.error(
        `Error watching for new blocks (attempt ${
          attempt + 1
        }/${MAX_RETRIES}):`,
        error
      );
      if (attempt === MAX_RETRIES - 1) {
        console.error("Max retries reached. Giving up.");
      } else {
        setTimeout(watchForNewBlocks, RETRY_DELAY);
      }
    }
  }

  // Schedule the next check
  setTimeout(watchForNewBlocks, 25000);
};

watchForNewBlocks();

export {
  blockEmitter,
  client,
  createBlock,
  getBlockTime,
  getLatestBlockReward,
  watchForNewBlocks,
};
