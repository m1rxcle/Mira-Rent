/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `orderId` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL,
DROP COLUMN "orderId",
ADD COLUMN     "orderId" SERIAL NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId");
