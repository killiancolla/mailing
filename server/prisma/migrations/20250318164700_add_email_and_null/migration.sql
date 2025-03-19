/*
  Warnings:

  - Added the required column `email` to the `Mail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Mail` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    MODIFY `opened_at` DATETIME(3) NULL;
