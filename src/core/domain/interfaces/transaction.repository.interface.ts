import { Transaction } from "../entities/transaction.entity";
import { TransactionStatus } from "../enums/transactionStatus.enum";

export interface ITransactionRepository {
    save(transaction: Transaction): Promise<Transaction>;
    findById(id: string): Promise<Transaction>;
    updateStatus(id: string, status: TransactionStatus): Promise<void>;
    findAllPending(): Promise<Transaction[]>;
}
