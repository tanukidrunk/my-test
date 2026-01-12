-- AlterTable
ALTER TABLE "Borrowed" ALTER COLUMN "status" SET DEFAULT 'BORROWED';

-- DropEnum
DROP TYPE "ReservationStatus";
