import { NextResponse } from "next/server";
import prisma from "@/app/services/database";

const GET = async () => {
  try {
    const blocks = await prisma.bitcoinBlock.findMany({
      orderBy: { height: "desc" },
      take: 25,
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
