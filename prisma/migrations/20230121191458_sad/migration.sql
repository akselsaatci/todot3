/*
  Warnings:

  - Made the column `createdAt` on table `toDo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "toDo" ALTER COLUMN "createdAt" SET NOT NULL;
