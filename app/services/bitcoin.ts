import dotenv from "dotenv";
import Client from "bitcoin-core";

import { EventEmitter } from "events";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

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
  timeout: 30000,
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

const watchForNewBlocks = async () => {
  try {
    const blockchainInfo = await client.getBlockchainInfo();
    const currentBlockHash = blockchainInfo.bestblockhash;
    if (lastKnownBlock === null) {
      lastKnownBlock = currentBlockHash;
    }
    if (lastKnownBlock !== currentBlockHash) {
      lastKnownBlock = currentBlockHash;

      const blockchainInfo = await client.getBlockchainInfo();
      const latestBlockHash = await client.getBlockHash(blockchainInfo.blocks);
      const block = await client.getBlock(latestBlockHash, 2);
      const blockReward = getLatestBlockReward(block);
      const blockTime = getBlockTime(block);
      blockEmitter.emit("newBlock", blockReward);
      console.log(`New block detected, rewards: ${blockReward}`);
      await prisma.bitcoinBlock.create({
        data: {
          id: currentBlockHash,
          height: blockchainInfo.blocks,
          timestamp: new Date(blockTime * 1000),
          reward: blockReward,
        },
      });
    }
  } catch (error) {
    console.error("Error watching for new blocks:", error);
  } finally {
    setTimeout(watchForNewBlocks, 10000);
  }
};

watchForNewBlocks();

export { blockEmitter, getLatestBlockReward, watchForNewBlocks };
