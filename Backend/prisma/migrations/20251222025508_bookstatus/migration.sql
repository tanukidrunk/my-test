-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('BORROWED', 'AVAILABLE');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "status" "BookStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "Borrowed" ALTER COLUMN "status" SET DEFAULT 'PENDING';
