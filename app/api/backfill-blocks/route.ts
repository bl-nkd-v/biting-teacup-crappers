import { NextResponse } from "next/server";
import { client, createBlock } from "@/app/services/bitcoin";

// TODO: Remove this route - Temporary fix for blocks not being backfilled
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Number(searchParams.get("count")) || 10; // Default to 10 blocks if not specified

  try {
    const blockchainInfo = await client.getBlockchainInfo();
    const currentHeight = blockchainInfo.blocks;
    const backfilledBlocks = [];

    for (let i = 0; i < count; i++) {
      const height = currentHeight - i;
      const blockHash = await client.getBlockHash(height);
      const block = await client.getBlock(blockHash, 2);

      // Create block record in database
      try {
        const createdBlock = await createBlock(blockHash, height, block);
        backfilledBlocks.push(createdBlock);
      } catch (error) {
        console.error(`Error creating block at height ${height}:`, error);
      }

      console.log(`Processed block at height ${height}`);
    }

    return NextResponse.json({
      message: `Backfilled ${count} blocks successfully`,
      blocks: backfilledBlocks,
    });
  } catch (error) {
    console.error("Error backfilling blocks:", error);
    return NextResponse.json(
      { error: "Failed to backfill blocks" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
