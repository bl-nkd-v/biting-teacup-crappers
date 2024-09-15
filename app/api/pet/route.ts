import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { calculateLevel } from "@/app/services/petCalculations";

const prisma = new PrismaClient();

const GET = async (request: Request) => {
  const userId = request.headers.get("user-id");
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    let pet = await prisma.pet.findUnique({ where: { userId } });
    if (!pet) {
      pet = await prisma.pet.create({
        data: {
          userId,
          hunger: 0,
          availableEggs: 0,
          eggsConsumed: 0,
          level: 1,
        },
      });
    }
    return NextResponse.json(pet);
  } catch (error) {
    console.error("Error fetching or creating pet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

const POST = async (request: Request) => {
  const userId = request.headers.get("user-id");
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const { action } = await request.json();
  const pet = await prisma.pet.findUnique({ where: { userId } });

  if (!pet) {
    return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  }

  if (action === "feed" && pet.availableEggs > 0 && pet.hunger > 0) {
    const eggsConsumed = pet.eggsConsumed + 1;
    const updatedPet = await prisma.pet.update({
      where: { userId },
      data: {
        hunger: Math.max(pet.hunger - 10, 0),
        availableEggs: pet.availableEggs - 1,
        eggsConsumed: eggsConsumed,
        level: calculateLevel(eggsConsumed),
        lastFed: new Date(),
      },
    });
    return NextResponse.json(updatedPet);
  }

  return NextResponse.json(pet);
};

export { GET, POST };
