import { NextResponse } from "next/server";
import { client, createBlock } from "@/app/services/bitcoin";
import prisma from "@/app/services/database";

// TODO: Add auth
// Done as a quick fix because the eggs/blocks are not updating on deployed environment (misunderstood how nextjs works)
export const GET = async () => {
  try {
    const blockchainInfo = await client.getBlockchainInfo();
    const currentHeight = blockchainInfo.blocks;
    const startHeight = Math.max(currentHeight - 3, 0);

    const processedBlocks = [];

    for (let height = startHeight; height <= currentHeight; height++) {
      const blockHash = await client.getBlockHash(height);
      const block = await client.getBlock(blockHash, 2);

      const existingBlock = await prisma.bitcoinBlock.findUnique({
        where: { id: blockHash },
      });

      if (!existingBlock) {
        await createBlock(blockHash, height, block);
        processedBlocks.push(height);

        const blockReward = block.tx[0].vout.reduce(
          (sum, output) => sum + output.value,
          0
        );
        const newEggs = Math.floor(blockReward * 10);
        await prisma.pet.updateMany({
          data: {
            availableEggs: { increment: newEggs },
          },
        });
      }
    }

    if (processedBlocks.length > 0) {
      return NextResponse.json({
        message: "Blockchain synced",
        processedBlocks: processedBlocks,
      });
    } else {
      return NextResponse.json({ message: "No new blocks to process" });
    }
  } catch (error) {
    console.error("Error syncing blockchain:", error);
    return NextResponse.json(
      { error: "Failed to sync blockchain" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";
