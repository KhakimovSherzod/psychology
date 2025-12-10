/*
  Warnings:

  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `subtitles` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Course` table. All the data in the column will be lost.
  - The `id` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `playlistThumbnailUrl` on the `Playlist` table. All the data in the column will be lost.
  - The `id` column on the `Playlist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CourseCategory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Course` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `courseId` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `Playlist` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_playlistId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP CONSTRAINT "Course_pkey",
DROP COLUMN "categoryId",
DROP COLUMN "description",
DROP COLUMN "level",
DROP COLUMN "order",
DROP COLUMN "playlistId",
DROP COLUMN "price",
DROP COLUMN "publishedAt",
DROP COLUMN "status",
DROP COLUMN "subtitles",
DROP COLUMN "thumbnailUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "uuid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_pkey",
DROP COLUMN "playlistThumbnailUrl",
ADD COLUMN     "courseId" INTEGER NOT NULL,
ADD COLUMN     "order" INTEGER,
ADD COLUMN     "uuid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ADD CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "CourseCategory";

-- DropEnum
DROP TYPE "Level";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "playbackUrl" TEXT NOT NULL,
    "order" INTEGER,
    "playlistId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VideoCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PlaylistCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_uuid_key" ON "Video"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Category_uuid_key" ON "Category"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_VideoCategories_AB_unique" ON "_VideoCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_VideoCategories_B_index" ON "_VideoCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PlaylistCategories_AB_unique" ON "_PlaylistCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_PlaylistCategories_B_index" ON "_PlaylistCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Course_uuid_key" ON "Course"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_uuid_key" ON "Playlist"("uuid");

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoCategories" ADD CONSTRAINT "_VideoCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoCategories" ADD CONSTRAINT "_VideoCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaylistCategories" ADD CONSTRAINT "_PlaylistCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaylistCategories" ADD CONSTRAINT "_PlaylistCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
