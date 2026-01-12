-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "otpCode" TEXT,
ADD COLUMN     "otpExpiry" TIMESTAMP(3),
ADD COLUMN     "twoFAEnabled" BOOLEAN NOT NULL DEFAULT false;
