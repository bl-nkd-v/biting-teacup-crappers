/*
  Warnings:

  - You are about to drop the column `eggs` on the `Pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "eggs",
ADD COLUMN     "availableEggs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "eggsConsumed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1;
