import { NextResponse } from "next/server";
import prisma from "@/app/services/database";

export const GET = async () => {
  try {
    const blocks = await prisma.bitcoinBlock.findMany({
      orderBy: { height: "desc" },
      take: 25,
    });

    const response = NextResponse.json(blocks);

    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;
  } catch (error) {
    console.error("Failed to fetch Bitcoin blocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch Bitcoin blocks" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";
