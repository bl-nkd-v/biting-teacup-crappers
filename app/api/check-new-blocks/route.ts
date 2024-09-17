import { NextResponse } from "next/server";
import {
  client,
  createBlock,
  getLatestBlockReward,
} from "@/app/services/bitcoin";
import prisma from "@/app/services/database";

// TODO: Add auth
// Done as a quick fix because the eggs/blocks are not updating on deployed environment (misunderstood how nextjs works)
export async function GET() {
  try {
    const blockchainInfo = await client.getBlockchainInfo();
    const currentBlockHash = blockchainInfo.bestblockhash;

    const lastKnownBlock = await prisma.bitcoinBlock.findFirst({
      orderBy: { height: "desc" },
    });

    if (!lastKnownBlock || lastKnownBlock.id !== currentBlockHash) {
      const latestBlockHash = await client.getBlockHash(blockchainInfo.blocks);
      const block = await client.getBlock(latestBlockHash, 2);
      const reward = getLatestBlockReward(block);
      await createBlock(latestBlockHash, blockchainInfo.blocks, block);

      const newEggs = Math.floor(reward * 10);
      await prisma.pet.updateMany({
        data: {
          availableEggs: { increment: newEggs },
        },
      });

      return NextResponse.json({
        message: "New block processed",
        blockHeight: blockchainInfo.blocks,
        reward,
      });
    }

    return NextResponse.json({ message: "No new blocks" });
  } catch (error) {
    console.error("Error checking for new blocks:", error);
    return NextResponse.json(
      { error: "Failed to check for new blocks" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
