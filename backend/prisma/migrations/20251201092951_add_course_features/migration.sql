/*
  Warnings:

  - You are about to drop the column `duration` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `isFree` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `previewDuration` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `subtitles` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `videoUrl` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnailUrl` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_userId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "duration",
DROP COLUMN "isFree",
DROP COLUMN "previewDuration",
DROP COLUMN "videoId",
ALTER COLUMN "subtitles" SET NOT NULL,
ALTER COLUMN "videoUrl" SET NOT NULL,
ALTER COLUMN "thumbnailUrl" SET NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "level" DROP DEFAULT,
ALTER COLUMN "price" DROP DEFAULT;

-- DropTable
DROP TABLE "Purchase";

-- DropEnum
DROP TYPE "PurchaseStatus";
