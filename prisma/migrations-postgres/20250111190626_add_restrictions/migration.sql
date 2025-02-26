-- DropForeignKey
ALTER TABLE "Period" DROP CONSTRAINT "Period_academicYearId_fkey";

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
