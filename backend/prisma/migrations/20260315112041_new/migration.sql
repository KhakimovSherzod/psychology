/*
  Warnings:

  - Made the column `description` on table `playlist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `playlistThumbnailUrl` on table `playlist` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "playlist" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "playlistThumbnailUrl" SET NOT NULL;
