import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionStatus } from "../../core/domain/enums/transactionStatus.enum";
import { ITransactionRepository } from "../../core/domain/interfaces/transaction.repository.interface";
import { Transaction } from "../../core/domain/entities/transaction.entity";

@Injectable()
export class TransactionRepository implements ITransactionRepository {
    constructor(
        @InjectRepository(Transaction)
        private readonly repository: Repository<Transaction>,
    ) { }

    async save(transaction: Transaction): Promise<Transaction> {
        return await this.repository.save(transaction);
    }
    async findById(id: string): Promise<Transaction> {
        return await this.repository.findOne({ where: { id } })
    }
    async updateStatus(id: string, status: TransactionStatus): Promise<void> {
        await this.repository.update(id, { status })
    }
    async findAllPending(): Promise<Transaction[]> {
        return await this.repository.find({ where: { status: TransactionStatus.PENDING } });
    }
}
