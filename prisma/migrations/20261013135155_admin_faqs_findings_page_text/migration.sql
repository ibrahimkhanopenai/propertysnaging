-- CreateTable
CREATE TABLE `FaqItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `page` VARCHAR(40) NOT NULL,
    `question` VARCHAR(500) NOT NULL,
    `answer` TEXT NOT NULL,
    `questionAr` VARCHAR(500) NULL,
    `answerAr` TEXT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FaqItem_page_sortOrder_idx`(`page`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Finding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(80) NOT NULL,
    `categoryAr` VARCHAR(80) NULL,
    `defect` VARCHAR(500) NOT NULL,
    `defectAr` VARCHAR(500) NULL,
    `fix` VARCHAR(500) NOT NULL,
    `fixAr` VARCHAR(500) NULL,
    `photo` VARCHAR(500) NOT NULL,
    `alt` VARCHAR(255) NOT NULL,
    `altAr` VARCHAR(255) NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Finding_published_sortOrder_idx`(`published`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PageText` (
    `page` VARCHAR(40) NOT NULL,
    `locale` ENUM('en', 'ar') NOT NULL,
    `hook` VARCHAR(300) NULL,
    `intro` TEXT NULL,
    `sections` JSON NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`page`, `locale`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
