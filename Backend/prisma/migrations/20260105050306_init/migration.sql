/*
  Warnings:

  - You are about to drop the column `otpCode` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiry` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `twoFAEnabled` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "otpCode",
DROP COLUMN "otpExpiry",
DROP COLUMN "twoFAEnabled";
