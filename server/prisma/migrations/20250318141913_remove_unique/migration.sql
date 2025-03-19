-- DropForeignKey
ALTER TABLE `Lead` DROP FOREIGN KEY `Lead_campagne_id_fkey`;

-- DropForeignKey
ALTER TABLE `Mail` DROP FOREIGN KEY `Mail_lead_id_fkey`;

-- DropIndex
DROP INDEX `Lead_campagne_id_key` ON `Lead`;

-- DropIndex
DROP INDEX `Mail_lead_id_key` ON `Mail`;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_campagne_id_fkey` FOREIGN KEY (`campagne_id`) REFERENCES `Campagne`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mail` ADD CONSTRAINT `Mail_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
