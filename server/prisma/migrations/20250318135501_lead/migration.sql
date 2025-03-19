/*
  Warnings:

  - A unique constraint covering the columns `[campagne_id]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `campagne_id` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `campagne_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Lead_campagne_id_key` ON `Lead`(`campagne_id`);

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_campagne_id_fkey` FOREIGN KEY (`campagne_id`) REFERENCES `Campagne`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
