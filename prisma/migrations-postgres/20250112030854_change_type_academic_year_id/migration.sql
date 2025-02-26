/*
  Warnings:

  - The primary key for the `AcademicYear` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CourseTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CourseTeacher" DROP CONSTRAINT "CourseTeacher_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "Period" DROP CONSTRAINT "Period_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_academicYearId_fkey";

-- AlterTable
ALTER TABLE "AcademicYear" DROP CONSTRAINT "AcademicYear_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(20),
ADD CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AcademicYear_id_seq";

-- AlterTable
ALTER TABLE "CourseTeacher" DROP CONSTRAINT "CourseTeacher_pkey",
ALTER COLUMN "academicYearId" SET DATA TYPE VARCHAR(20),
ADD CONSTRAINT "CourseTeacher_pkey" PRIMARY KEY ("subjectId", "teacherId", "courseId", "academicYearId");

-- AlterTable
ALTER TABLE "Period" ALTER COLUMN "academicYearId" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "academicYearId" SET DATA TYPE VARCHAR(20);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTeacher" ADD CONSTRAINT "CourseTeacher_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
