/*
  Warnings:

  - You are about to drop the column `subscriptionType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionValidTill` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'OWNER';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "subscriptionType",
DROP COLUMN "subscriptionValidTill",
DROP COLUMN "verified";

-- DropEnum
DROP TYPE "SubscriptionType";
