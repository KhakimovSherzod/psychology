/*
  Warnings:

  - You are about to drop the `purchase` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "purchase" DROP CONSTRAINT "purchase_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "purchase" DROP CONSTRAINT "purchase_userId_fkey";

-- AlterTable
ALTER TABLE "category" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "enrollment" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "paymentId" INTEGER,
ADD COLUMN     "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "review" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "purchase";

-- DropEnum
DROP TYPE "ProductType";

-- DropEnum
DROP TYPE "PurchaseStatus";

-- CreateIndex
CREATE INDEX "enrollment_status_idx" ON "enrollment"("status");

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
