-- CreateTable
CREATE TABLE `AdminUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(120) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('POST', 'DEVELOPER') NOT NULL DEFAULT 'POST',
    `locale` ENUM('en', 'ar') NOT NULL DEFAULT 'en',
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NOT NULL,
    `featuredImage` VARCHAR(500) NULL,
    `featuredImageAlt` VARCHAR(255) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'SCHEDULED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `authorName` VARCHAR(120) NULL,
    `categoryId` INTEGER NULL,
    `tags` VARCHAR(500) NULL,
    `location` VARCHAR(40) NULL,
    `relatedService` VARCHAR(255) NULL,
    `tocEnabled` BOOLEAN NOT NULL DEFAULT true,
    `metaTitle` VARCHAR(255) NULL,
    `metaDescription` VARCHAR(500) NULL,
    `focusKeyword` VARCHAR(191) NULL,
    `secondaryKeywords` VARCHAR(500) NULL,
    `canonicalUrl` VARCHAR(500) NULL,
    `ogTitle` VARCHAR(255) NULL,
    `ogDescription` VARCHAR(500) NULL,
    `ogImage` VARCHAR(500) NULL,
    `robotsIndex` BOOLEAN NOT NULL DEFAULT true,
    `robotsFollow` BOOLEAN NOT NULL DEFAULT true,
    `schemaType` VARCHAR(40) NOT NULL DEFAULT 'BlogPosting',
    `faqs` JSON NULL,
    `breadcrumbTitle` VARCHAR(120) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Post_type_status_publishedAt_idx`(`type`, `status`, `publishedAt`),
    UNIQUE INDEX `Post_locale_slug_key`(`locale`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Redirect` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromPath` VARCHAR(191) NOT NULL,
    `toPath` VARCHAR(500) NOT NULL,
    `statusCode` INTEGER NOT NULL DEFAULT 301,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Redirect_fromPath_key`(`fromPath`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `phone` VARCHAR(40) NOT NULL,
    `email` VARCHAR(191) NULL,
    `propertyType` VARCHAR(40) NULL,
    `bedrooms` INTEGER NULL,
    `areaSqft` INTEGER NULL,
    `emirate` VARCHAR(60) NULL,
    `location` VARCHAR(191) NULL,
    `source` VARCHAR(40) NULL,
    `message` TEXT NULL,
    `estimatedPrice` INTEGER NULL,
    `locale` VARCHAR(5) NULL,
    `pagePath` VARCHAR(255) NULL,
    `emailSent` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Lead_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `location` VARCHAR(120) NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `text` TEXT NOT NULL,
    `source` VARCHAR(40) NOT NULL DEFAULT 'google',
    `reviewDate` DATETIME(3) NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GalleryImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(500) NOT NULL,
    `alt` VARCHAR(255) NOT NULL,
    `caption` VARCHAR(255) NULL,
    `category` VARCHAR(40) NOT NULL DEFAULT 'defects',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
