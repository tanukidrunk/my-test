/*
  Warnings:

  - You are about to drop the `Fine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FinePayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fine" DROP CONSTRAINT "Fine_loanId_fkey";

-- DropForeignKey
ALTER TABLE "FinePayment" DROP CONSTRAINT "FinePayment_fineId_fkey";

-- DropForeignKey
ALTER TABLE "FinePayment" DROP CONSTRAINT "FinePayment_memberId_fkey";

-- DropTable
DROP TABLE "Fine";

-- DropTable
DROP TABLE "FinePayment";

-- DropEnum
DROP TYPE "FineStatus";
