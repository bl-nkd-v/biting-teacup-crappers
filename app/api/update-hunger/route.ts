import { NextResponse } from "next/server";
import prisma from "@/app/services/database";

// TODO: Add auth
// Done as a quick fix because the hunger is not updating on deployed environment (misunderstood how nextjs works)
export async function GET() {
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

    return NextResponse.json({ message: "Hunger updated for all pets" });
  } catch (error) {
    console.error("Error updating hunger:", error);
    return NextResponse.json(
      { error: "Failed to update hunger" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
