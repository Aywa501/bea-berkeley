-- AlterTable
ALTER TABLE "ExecBoardMember" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "RecruitmentEvent" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "RecruitmentForm" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Speaker" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
