import { NextResponse } from "next/server";
import prisma from "@/app/services/database";

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
        eggsConsumed: "desc",
      },
      take: 100, // Limit to top 100 pets
    });
    const response = NextResponse.json(pets);

    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
