-- AlterTable
ALTER TABLE `BankAccount` MODIFY `initialBalance` DECIMAL(65, 30) NOT NULL DEFAULT 10.2,
    MODIFY `currentBalance` DECIMAL(65, 30) NOT NULL DEFAULT 10.2;
