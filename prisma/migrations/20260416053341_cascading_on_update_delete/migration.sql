-- DropForeignKey
ALTER TABLE `Option` DROP FOREIGN KEY `Option_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_quizId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizAttempt` DROP FOREIGN KEY `QuizAttempt_quizId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizAttempt` DROP FOREIGN KEY `QuizAttempt_userId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizResult` DROP FOREIGN KEY `QuizResult_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizResult` DROP FOREIGN KEY `QuizResult_quizAttemptId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizResult` DROP FOREIGN KEY `QuizResult_selectedOptionId_fkey`;

-- DropIndex
DROP INDEX `Option_questionId_fkey` ON `Option`;

-- DropIndex
DROP INDEX `Question_quizId_fkey` ON `Question`;

-- DropIndex
DROP INDEX `QuizAttempt_quizId_fkey` ON `QuizAttempt`;

-- DropIndex
DROP INDEX `QuizAttempt_userId_fkey` ON `QuizAttempt`;

-- DropIndex
DROP INDEX `QuizResult_questionId_fkey` ON `QuizResult`;

-- DropIndex
DROP INDEX `QuizResult_quizAttemptId_fkey` ON `QuizResult`;

-- DropIndex
DROP INDEX `QuizResult_selectedOptionId_fkey` ON `QuizResult`;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizAttempt` ADD CONSTRAINT `QuizAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizAttempt` ADD CONSTRAINT `QuizAttempt_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `Quiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizResult` ADD CONSTRAINT `QuizResult_quizAttemptId_fkey` FOREIGN KEY (`quizAttemptId`) REFERENCES `QuizAttempt`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizResult` ADD CONSTRAINT `QuizResult_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizResult` ADD CONSTRAINT `QuizResult_selectedOptionId_fkey` FOREIGN KEY (`selectedOptionId`) REFERENCES `Option`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
