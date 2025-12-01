/*
  Warnings:

  - Added the required column `description` to the `CourseCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseCategory" ADD COLUMN     "description" TEXT NOT NULL;
