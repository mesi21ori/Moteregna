-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "perkilometer" DOUBLE PRECISION NOT NULL DEFAULT 1.2,
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'default-user-id';
