import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "src/core/domain/entities/transaction.entity";
import { TransactionStatus } from "src/core/domain/enums/transactionStatus.enum";
import { ITransactionRepository } from "src/core/domain/interfaces/transaction.repository.interface";
import { Repository } from "typeorm";


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

        return await this.repository.findOne({ where: { id } });
    }
    async updateStatus(id: string, status: TransactionStatus): Promise<void> {

        await this.repository.update(id, { status });
    }
    async findAllPending(): Promise<Transaction[]> {

        return await this.repository.find({ where: { status: TransactionStatus.PENDING } });
    }
}