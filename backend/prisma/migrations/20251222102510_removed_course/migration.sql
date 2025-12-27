/*
  Warnings:

  - You are about to drop the column `courseId` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_courseId_fkey";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "courseId";

-- DropTable
DROP TABLE "Course";
