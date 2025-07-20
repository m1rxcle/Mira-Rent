/*
  Warnings:

  - The values [SUCCESS] on the enum `OrderStatuses` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatuses_new" AS ENUM ('PENDING', 'SUCCEEDED', 'CANCELLED');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatuses_new" USING ("status"::text::"OrderStatuses_new");
ALTER TYPE "OrderStatuses" RENAME TO "OrderStatuses_old";
ALTER TYPE "OrderStatuses_new" RENAME TO "OrderStatuses";
DROP TYPE "OrderStatuses_old";
COMMIT;
