/*
 Warnings:
 
 - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to alter the column `id` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
 - You are about to alter the column `name` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
 - The primary key for the `CourseTeacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to alter the column `subjectId` on the `CourseTeacher` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
 - You are about to alter the column `courseId` on the `CourseTeacher` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
 - You are about to alter the column `observation` on the `DisciplineRecord` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
 - You are about to drop the column `courseId` on the `Grade` table. All the data in the column will be lost.
 - You are about to alter the column `subjectId` on the `Grade` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
 - You are about to alter the column `score` on the `Grade` table. The data in that column could be lost. The data in that column will be cast from `Real` to `Decimal(5,2)`.
 - You are about to alter the column `name` on the `Period` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
 - You are about to alter the column `label` on the `Period` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
 - You are about to alter the column `year` on the `Period` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(10)`.
 - You are about to drop the column `dateOfBirth` on the `Representative` table. All the data in the column will be lost.
 - You are about to drop the column `fullName` on the `Representative` table. All the data in the column will be lost.
 - You are about to alter the column `dni` on the `Representative` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(10)`.
 - You are about to alter the column `name` on the `Representative` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
 - You are about to alter the column `lastName` on the `Representative` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
 - You are about to alter the column `email` on the `Representative` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
 - You are about to alter the column `workPlace` on the `Representative` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(200)`.
 - You are about to alter the column `workstation` on the `Representative` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(200)`.
 - You are about to alter the column `phone1` on the `Representative` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(15)`.
 - You are about to alter the column `phone2` on the `Representative` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(15)`.
 - You are about to alter the column `address` on the `Representative` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
 - You are about to alter the column `relationship` on the `Representative` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
 - You are about to alter the column `type` on the `Role` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
 - You are about to drop the column `fullName` on the `Student` table. All the data in the column will be lost.
 - You are about to alter the column `dni` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(10)`.
 - You are about to alter the column `firstName` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
 - You are about to alter the column `lastName` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
 - The `gender` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
 - You are about to alter the column `address` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
 - You are about to alter the column `courseId` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
 - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to alter the column `id` on the `Subject` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
 - You are about to alter the column `name` on the `Subject` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
 - You are about to alter the column `description` on the `Subject` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
 - You are about to drop the column `phone` on the `Teacher` table. All the data in the column will be lost.
 - You are about to alter the column `dni` on the `Teacher` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(10)`.
 - You are about to alter the column `firstName` on the `Teacher` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
 - You are about to alter the column `lastName` on the `Teacher` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
 - You are about to alter the column `email` on the `Teacher` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
 - You are about to alter the column `type` on the `TypePeriod` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
 - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
 - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
 - A unique constraint covering the columns `[dni]` on the table `Representative` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[email]` on the table `Representative` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[dni]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[dni]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[email]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
 - Made the column `roleId` on table `User` required. This step will fail if there are existing NULL values in that column.
 
 */
-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('Male', 'Female', 'Other');

-- DropForeignKey
ALTER TABLE
  "CourseTeacher" DROP CONSTRAINT "CourseTeacher_courseId_fkey";

-- DropForeignKey
ALTER TABLE
  "CourseTeacher" DROP CONSTRAINT "CourseTeacher_subjectId_fkey";

-- DropForeignKey
ALTER TABLE
  "Grade" DROP CONSTRAINT "Grade_courseId_fkey";

-- DropForeignKey
ALTER TABLE
  "Grade" DROP CONSTRAINT "Grade_subjectId_fkey";

-- DropForeignKey
ALTER TABLE
  "Student" DROP CONSTRAINT "Student_courseId_fkey";

-- DropIndex
DROP INDEX "Representative_dni_email_idx";

-- DropIndex
DROP INDEX "Student_dni_representativeId_idx";

-- DropIndex
DROP INDEX "Teacher_email_dni_idx";

-- AlterTable
ALTER TABLE
  "Course" DROP CONSTRAINT "Course_pkey",
ALTER COLUMN
  "id"
SET
  DATA TYPE VARCHAR(20),
ALTER COLUMN
  "name"
SET
  DATA TYPE VARCHAR(100),
ADD
  CONSTRAINT "Course_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE
  "CourseTeacher" DROP CONSTRAINT "CourseTeacher_pkey",
ALTER COLUMN
  "subjectId"
SET
  DATA TYPE VARCHAR(20),
ALTER COLUMN
  "courseId"
SET
  DATA TYPE VARCHAR(20),
ADD
  CONSTRAINT "CourseTeacher_pkey" PRIMARY KEY ("subjectId", "teacherId", "courseId");

-- AlterTable
ALTER TABLE
  "DisciplineRecord"
ALTER COLUMN
  "observation"
SET
  DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE
  "Grade" DROP COLUMN "courseId",
ALTER COLUMN
  "subjectId"
SET
  DATA TYPE VARCHAR(20),
ALTER COLUMN
  "score"
SET
  DATA TYPE DECIMAL(5, 2);

-- AlterTable
ALTER TABLE
  "Period"
ALTER COLUMN
  "name"
SET
  DATA TYPE VARCHAR(50),
ALTER COLUMN
  "label"
SET
  DATA TYPE VARCHAR(50),
ALTER COLUMN
  "year"
SET
  DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE
  "Representative" DROP COLUMN "dateOfBirth",
  DROP COLUMN "fullName",
ALTER COLUMN
  "dni"
SET
  DATA TYPE VARCHAR(15),
ALTER COLUMN
  "name"
SET
  DATA TYPE VARCHAR(50),
ALTER COLUMN
  "lastName"
SET
  DATA TYPE VARCHAR(50),
ALTER COLUMN
  "email"
SET
  DATA TYPE VARCHAR(100),
ALTER COLUMN
  "workPlace"
SET
  DATA TYPE VARCHAR(200),
ALTER COLUMN
  "workstation"
SET
  DATA TYPE VARCHAR(200),
ALTER COLUMN
  "phone1"
SET
  DATA TYPE VARCHAR(15),
ALTER COLUMN
  "phone2"
SET
  DATA TYPE VARCHAR(15),
ALTER COLUMN
  "address"
SET
  DATA TYPE VARCHAR(255),
ALTER COLUMN
  "relationship"
SET
  DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE
  "Role"
ALTER COLUMN
  "type"
SET
  DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE
  "Student" DROP COLUMN "fullName",
ALTER COLUMN
  "dni"
SET
  DATA TYPE VARCHAR(15),
ALTER COLUMN
  "firstName"
SET
  DATA TYPE VARCHAR(50),
ALTER COLUMN
  "lastName"
SET
  DATA TYPE VARCHAR(50),
  DROP COLUMN "gender",
ADD
  COLUMN "gender" "GenderEnum",
ALTER COLUMN
  "address"
SET
  DATA TYPE VARCHAR(255),
ALTER COLUMN
  "courseId"
SET
  DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE
  "Subject" DROP CONSTRAINT "Subject_pkey",
ALTER COLUMN
  "id"
SET
  DATA TYPE VARCHAR(20),
ALTER COLUMN
  "name"
SET
  DATA TYPE VARCHAR(100),
ALTER COLUMN
  "description"
SET
  DATA TYPE VARCHAR(255),
ADD
  CONSTRAINT "Subject_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE
  "Teacher" DROP COLUMN "phone",
ALTER COLUMN
  "dni"
SET
  DATA TYPE VARCHAR(15),
ALTER COLUMN
  "firstName"
SET
  DATA TYPE VARCHAR(50),
ALTER COLUMN
  "lastName"
SET
  DATA TYPE VARCHAR(50),
ALTER COLUMN
  "email"
SET
  DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE
  "TypePeriod"
ALTER COLUMN
  "type"
SET
  DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE
  "User"
ALTER COLUMN
  "username"
SET
  DATA TYPE VARCHAR(50),
ALTER COLUMN
  "password"
SET
  DATA TYPE VARCHAR(255),
ALTER COLUMN
  "roleId"
SET
  NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Representative_dni_key" ON "Representative"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Representative_email_key" ON "Representative"("email");

-- CreateIndex
CREATE INDEX "Representative_dni_idx" ON "Representative"("dni");

-- CreateIndex
CREATE INDEX "Representative_email_idx" ON "Representative"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_dni_key" ON "Student"("dni");

-- CreateIndex
CREATE INDEX "Student_representativeId_idx" ON "Student"("representativeId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_dni_key" ON "Teacher"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE INDEX "Teacher_email_idx" ON "Teacher"("email");

-- CreateIndex
CREATE INDEX "Teacher_dni_idx" ON "Teacher"("dni");

-- AddForeignKey
ALTER TABLE
  "Student"
ADD
  CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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