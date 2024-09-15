import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pets = await prisma.pet.findMany({
      select: {
        id: true,
        name: true,
        eggsConsumed: true,
        level: true,
        lastFed: true,
        userId: true,
      },
      orderBy: {
        level: "desc",
      },
      take: 100, // Limit to top 100 pets
    });

    return NextResponse.json(pets);
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}
