-- CreateEnum
CREATE TYPE "OrderStatuses" AS ENUM ('PENDING', 'SUCCESS', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatuses";
