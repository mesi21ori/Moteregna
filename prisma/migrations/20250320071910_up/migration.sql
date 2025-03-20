-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_endLocationId_fkey";

-- AlterTable
ALTER TABLE "Delivery" ALTER COLUMN "endLocationId" DROP NOT NULL,
ALTER COLUMN "endLocationId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_endLocationId_fkey" FOREIGN KEY ("endLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
