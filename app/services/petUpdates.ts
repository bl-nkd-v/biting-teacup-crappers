import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { blockEmitter } from "./bitcoin";

const prisma = new PrismaClient();

// For Local Usage

const updateAvailableEggs = async (blockReward: number) => {
  try {
    const newEggs = Math.floor(blockReward * 10); // 1 egg per 0.1 BTC Block Reward

    await prisma.pet.updateMany({
      data: {
        availableEggs: {
          increment: newEggs,
        },
      },
    });

    console.log(`Updated all pets with ${newEggs} new eggs`);
  } catch (error) {
    console.error("Error updating eggs:", error);
  }
};

const updateHunger = async () => {
  try {
    await prisma.pet.updateMany({
      data: {
        hunger: {
          increment: 1,
        },
      },
      where: {
        hunger: {
          lt: 100,
        },
      },
    });

    console.log("Updated hunger for all pets");
  } catch (error) {
    console.error("Error updating hunger:", error);
  }
};

const startPetUpdateJobs = () => {
  // On new block, update eggs
  blockEmitter.on("newBlock", updateAvailableEggs);
  console.log("Block event listener initialized");

  // Update hunger every minute
  cron.schedule("* * * * *", updateHunger);
  console.log("Hunger update cron job scheduled");
};

export { startPetUpdateJobs };
