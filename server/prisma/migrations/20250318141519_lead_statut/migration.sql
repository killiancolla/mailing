/*
  Warnings:

  - You are about to alter the column `statut` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Lead` MODIFY `statut` INTEGER NOT NULL DEFAULT 1;
