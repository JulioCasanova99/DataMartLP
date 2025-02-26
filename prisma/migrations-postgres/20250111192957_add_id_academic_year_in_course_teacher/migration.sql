/*
  Warnings:

  - The primary key for the `CourseTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `academicYearId` on table `CourseTeacher` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CourseTeacher" DROP CONSTRAINT "CourseTeacher_academicYearId_fkey";

-- AlterTable
ALTER TABLE "CourseTeacher" DROP CONSTRAINT "CourseTeacher_pkey",
ALTER COLUMN "academicYearId" SET NOT NULL,
ADD CONSTRAINT "CourseTeacher_pkey" PRIMARY KEY ("subjectId", "teacherId", "courseId", "academicYearId");

-- AddForeignKey
ALTER TABLE "CourseTeacher" ADD CONSTRAINT "CourseTeacher_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
