/*
 Warnings:
 
 - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
 
 */
-- AlterTable
ALTER TABLE
  "Subject"
ALTER COLUMN
  "id"
SET
  DATA TYPE VARCHAR;