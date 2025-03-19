/*
  Warnings:

  - Added the required column `campagne_id` to the `Mail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Mail` ADD COLUMN `campagne_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Mail` ADD CONSTRAINT `Mail_campagne_id_fkey` FOREIGN KEY (`campagne_id`) REFERENCES `Campagne`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
