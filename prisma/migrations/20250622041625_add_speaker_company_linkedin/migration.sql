/*
  Warnings:

  - Added the required column `company` to the `Speaker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Speaker" ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "linkedin" TEXT;
