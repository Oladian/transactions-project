import { Injectable } from "@nestjs/common";
import { Transaction } from "src/core/domain/entities/transaction.entity";
import { TransactionStatus } from "src/core/domain/enums/transactionStatus.enum";
import { TransactionRepository } from "src/database/repositories/transaction/transaction.repository";

@Injectable()
export class TransactionService {
    constructor(private transactionRepository: TransactionRepository) { }

    async requestTransaction(transaction: Transaction): Promise<Transaction> {
        return await this.transactionRepository.save(transaction);
    }

    async validateTransaction(
        transactionId: string,
        status: TransactionStatus): Promise<void> {

        this.transactionRepository.updateStatus(transactionId, status);
    }

    async getTransactionById(id: string) {
        return this.transactionRepository.findById(id);
    }

    async getPendingTransactions() {
        return this.transactionRepository.findAllPending();
    }
}