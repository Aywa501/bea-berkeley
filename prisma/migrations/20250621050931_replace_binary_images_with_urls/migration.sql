/*
  Warnings:

  - You are about to drop the column `image` on the `ExecBoardMember` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Speaker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExecBoardMember" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Speaker" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT;
