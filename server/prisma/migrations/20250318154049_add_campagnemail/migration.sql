-- CreateTable
CREATE TABLE `CampagneMail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campagne_id` INTEGER NOT NULL,
    `step` INTEGER NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CampagneMail` ADD CONSTRAINT `CampagneMail_campagne_id_fkey` FOREIGN KEY (`campagne_id`) REFERENCES `Campagne`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
