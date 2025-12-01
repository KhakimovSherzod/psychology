/*
  Warnings:

  - You are about to drop the `CourseCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Playlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_playlistId_fkey";

-- DropTable
DROP TABLE "CourseCategory";

-- DropTable
DROP TABLE "Playlist";

-- CreateTable
CREATE TABLE "CourseCategories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlists" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "playlistThumbnailUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseCategories_name_key" ON "CourseCategories"("name");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CourseCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
