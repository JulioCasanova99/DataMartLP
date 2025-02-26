-- DropForeignKey
ALTER TABLE
  "CourseTeacher" DROP CONSTRAINT "CourseTeacher_courseId_fkey";

-- DropForeignKey
ALTER TABLE
  "CourseTeacher" DROP CONSTRAINT "CourseTeacher_subjectId_fkey";

-- DropForeignKey
ALTER TABLE
  "CourseTeacher" DROP CONSTRAINT "CourseTeacher_teacherId_fkey";

-- DropForeignKey
ALTER TABLE
  "DisciplineRecord" DROP CONSTRAINT "DisciplineRecord_periodId_fkey";

-- DropForeignKey
ALTER TABLE
  "DisciplineRecord" DROP CONSTRAINT "DisciplineRecord_studentId_fkey";

-- DropForeignKey
ALTER TABLE
  "Grade" DROP CONSTRAINT "Grade_courseId_fkey";

-- DropForeignKey
ALTER TABLE
  "Grade" DROP CONSTRAINT "Grade_periodId_fkey";

-- DropForeignKey
ALTER TABLE
  "Grade" DROP CONSTRAINT "Grade_studentId_fkey";

-- DropForeignKey
ALTER TABLE
  "Grade" DROP CONSTRAINT "Grade_subjectId_fkey";

-- DropForeignKey
ALTER TABLE
  "Period" DROP CONSTRAINT "Period_typePeriodId_fkey";

-- DropForeignKey
ALTER TABLE
  "Student" DROP CONSTRAINT "Student_representativeId_fkey";

-- AlterTable
ALTER TABLE
  "Student"
ADD
  COLUMN "courseId" VARCHAR;

-- AddForeignKey
ALTER TABLE
  "Student"
ADD
  CONSTRAINT "Student_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "Representative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "Student"
ADD
  CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "Period"
ADD
  CONSTRAINT "Period_typePeriodId_fkey" FOREIGN KEY ("typePeriodId") REFERENCES "TypePeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "CourseTeacher"
ADD
  CONSTRAINT "CourseTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "CourseTeacher"
ADD
  CONSTRAINT "CourseTeacher_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "CourseTeacher"
ADD
  CONSTRAINT "CourseTeacher_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "Grade"
ADD
  CONSTRAINT "Grade_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "Grade"
ADD
  CONSTRAINT "Grade_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "Grade"
ADD
  CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "Grade"
ADD
  CONSTRAINT "Grade_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "DisciplineRecord"
ADD
  CONSTRAINT "DisciplineRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "DisciplineRecord"
ADD
  CONSTRAINT "DisciplineRecord_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateRole
INSERT INTO
  "Role" ("type")
VALUES
  ('DIRECTOR');