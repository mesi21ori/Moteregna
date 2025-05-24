/*
  Warnings:

  - You are about to drop the column `initialPrice` on the `Price` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Price" DROP COLUMN "initialPrice",
ADD COLUMN     "Price" DOUBLE PRECISION NOT NULL DEFAULT 100,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isActiveDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "perminute" DOUBLE PRECISION NOT NULL DEFAULT 0.5;
