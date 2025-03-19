-- AlterTable
ALTER TABLE `Mail` ADD COLUMN `campagne_mail_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Mail` ADD CONSTRAINT `Mail_campagne_mail_id_fkey` FOREIGN KEY (`campagne_mail_id`) REFERENCES `CampagneMail`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
