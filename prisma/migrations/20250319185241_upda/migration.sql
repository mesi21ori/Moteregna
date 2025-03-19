/*
  Warnings:

  - You are about to drop the `MotoristStatistics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MotoristStatistics" DROP CONSTRAINT "MotoristStatistics_motoristId_fkey";

-- DropTable
DROP TABLE "MotoristStatistics";
