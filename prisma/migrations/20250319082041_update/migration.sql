/*
  Warnings:

  - Added the required column `driversLicencephotoBack` to the `Motorist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `driversLicencephotoFront` to the `Motorist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Motorist" ADD COLUMN     "driversLicencephotoBack" TEXT NOT NULL,
ADD COLUMN     "driversLicencephotoFront" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "middleName" TEXT;
