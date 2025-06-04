/*
  Warnings:

  - The `seats` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `dayOfWekk` on the `WorkingHour` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dealersihpId,dayOfWeek]` on the table `WorkingHour` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `year` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `mileage` on the `Car` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `dayOfWeek` to the `WorkingHour` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "WorkingHour_dayOfWekk_idx";

-- DropIndex
DROP INDEX "WorkingHour_dealersihpId_dayOfWekk_key";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL,
DROP COLUMN "mileage",
ADD COLUMN     "mileage" INTEGER NOT NULL,
DROP COLUMN "seats",
ADD COLUMN     "seats" INTEGER;

-- AlterTable
ALTER TABLE "WorkingHour" DROP COLUMN "dayOfWekk",
ADD COLUMN     "dayOfWeek" "DayOfWeek" NOT NULL;

-- CreateIndex
CREATE INDEX "Car_year_idx" ON "Car"("year");

-- CreateIndex
CREATE INDEX "WorkingHour_dayOfWeek_idx" ON "WorkingHour"("dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHour_dealersihpId_dayOfWeek_key" ON "WorkingHour"("dealersihpId", "dayOfWeek");
