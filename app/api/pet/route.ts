import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { calculateLevel } from "@/app/services/petCalculations";

const prisma = new PrismaClient();

const generateTraits = () => {
  return {
    baseShape: Math.floor(Math.random() * 3),
    eyes: Math.floor(Math.random() * 2),
    mouth: Math.floor(Math.random() * 2),
    accessory: Math.floor(Math.random() * 3),
    colorScheme: Math.floor(Math.random() * 4),
  };
};

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
          availableEggs: 25,
          eggsConsumed: 0,
          level: 1,
          traits: generateTraits(),
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

  if (action === "feed" && pet.availableEggs > 0) {
    const feedAmount = 1;
    const eggsConsumed = pet.eggsConsumed + feedAmount;
    const hunger = Math.max(pet.hunger - 10, 0);
    const availableEggs = Math.max(pet.availableEggs - feedAmount, 0);
    const updatedPet = await prisma.pet.update({
      where: { userId },
      data: {
        hunger,
        availableEggs,
        eggsConsumed,
        level: calculateLevel(eggsConsumed),
        lastFed: new Date(),
      },
    });
    return NextResponse.json(updatedPet);
  }

  return NextResponse.json(pet);
};

const PUT = async (request: Request) => {
  const { userId, name } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const updatedPet = await prisma.pet.update({
      where: { userId },
      data: { name },
    });
    return NextResponse.json(updatedPet);
  } catch (error) {
    console.error("Error updating pet:", error);
    return NextResponse.json(
      { error: "Failed to update pet" },
      { status: 500 }
    );
  }
};

export { GET, POST, PUT };
