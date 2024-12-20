/*
  Warnings:

  - The `title` column on the `History` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "title",
ADD COLUMN     "title" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
