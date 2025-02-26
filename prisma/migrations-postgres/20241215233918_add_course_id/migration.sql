/*
  Warnings:

  - You are about to drop the column `courseId` on the `Student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_courseId_fkey";

-- DropIndex
DROP INDEX "Student_courseId_dni_representativeId_idx";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "courseId";

-- CreateIndex
CREATE INDEX "Student_dni_representativeId_idx" ON "Student"("dni", "representativeId");
