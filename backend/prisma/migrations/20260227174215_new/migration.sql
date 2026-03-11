/*
  Warnings:

  - You are about to drop the column `orderId` on the `enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderItemId]` on the table `enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "enrollment" DROP CONSTRAINT "enrollment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_playlistId_fkey";

-- DropIndex
DROP INDEX "enrollment_orderId_key";

-- DropIndex
DROP INDEX "order_playlistId_idx";

-- AlterTable
ALTER TABLE "enrollment" DROP COLUMN "orderId",
ADD COLUMN     "orderItemId" INTEGER;

-- AlterTable
ALTER TABLE "order" DROP COLUMN "playlistId";

-- AlterTable
ALTER TABLE "review" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "orderItem" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UZS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orderItem_uuid_key" ON "orderItem"("uuid");

-- CreateIndex
CREATE INDEX "orderItem_orderId_idx" ON "orderItem"("orderId");

-- CreateIndex
CREATE INDEX "orderItem_playlistId_idx" ON "orderItem"("playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "orderItem_orderId_playlistId_key" ON "orderItem"("orderId", "playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_orderItemId_key" ON "enrollment"("orderItemId");

-- CreateIndex
CREATE INDEX "enrollment_orderItemId_idx" ON "enrollment"("orderItemId");

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "orderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
