/*
  Warnings:

  - You are about to drop the column `driversLicencephotoBack` on the `Motorist` table. All the data in the column will be lost.
  - Added the required column `Librephoto` to the `Motorist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessPermit` to the `Motorist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Motorist" DROP COLUMN "driversLicencephotoBack",
ADD COLUMN     "Librephoto" TEXT NOT NULL,
ADD COLUMN     "businessPermit" TEXT NOT NULL;
