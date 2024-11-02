import { Module } from "@nestjs/common";
import { TransactionRepository } from "./repositories/transaction/transaction.repository";
import { UserRepository } from "./repositories/user/user.repository";
import { Transaction } from "src/core/domain/entities/transaction.entity";
import { User } from "src/core/domain/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({

    exports: [ UserRepository, TransactionRepository ],
    imports: [
        TypeOrmModule.forFeature([Transaction]),
        TypeOrmModule.forFeature([User])
    ],
    providers: [
        UserRepository, TransactionRepository
    ],
})

export class DatabaseModule {
}
