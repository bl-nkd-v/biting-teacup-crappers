import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GET = async () => {
  try {
    const blocks = await prisma.bitcoinBlock.findMany({
      orderBy: { height: "desc" },
      take: 5,
    });
    return NextResponse.json(blocks);
  } catch (error) {
    console.error("Failed to fetch Bitcoin blocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch Bitcoin blocks" },
      { status: 500 }
    );
  }
};

export { GET };
