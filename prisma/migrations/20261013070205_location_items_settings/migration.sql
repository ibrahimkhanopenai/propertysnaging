-- CreateTable
CREATE TABLE `LocationItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emirate` VARCHAR(20) NOT NULL,
    `kind` ENUM('AREA', 'COMMUNITY') NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `nameAr` VARCHAR(160) NULL,
    `developer` VARCHAR(120) NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LocationItem_emirate_kind_sortOrder_idx`(`emirate`, `kind`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `key` VARCHAR(64) NOT NULL,
    `value` VARCHAR(1000) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
