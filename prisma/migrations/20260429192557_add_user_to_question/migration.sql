-- AlterTable
ALTER TABLE `questions` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `quizzes` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
