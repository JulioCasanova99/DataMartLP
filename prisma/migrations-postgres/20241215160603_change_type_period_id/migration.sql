/*
  Warnings:

  - The primary key for the `TypePeriod` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Period" DROP CONSTRAINT "Period_typePeriodId_fkey";

-- AlterTable
ALTER TABLE "Period" ALTER COLUMN "typePeriodId" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "TypePeriod" DROP CONSTRAINT "TypePeriod_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(20),
ADD CONSTRAINT "TypePeriod_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TypePeriod_id_seq";

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_typePeriodId_fkey" FOREIGN KEY ("typePeriodId") REFERENCES "TypePeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
