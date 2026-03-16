/*
  Warnings:

  - Made the column `description` on table `video` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "video" ALTER COLUMN "description" SET NOT NULL;
