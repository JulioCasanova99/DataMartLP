/*
  Warnings:

  - You are about to drop the column `year` on the `Period` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CourseTeacher" ADD COLUMN     "academicYearId" INTEGER;

-- AlterTable
ALTER TABLE "Period" DROP COLUMN "year";

-- AddForeignKey
ALTER TABLE "CourseTeacher" ADD CONSTRAINT "CourseTeacher_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;
