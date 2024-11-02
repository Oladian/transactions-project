import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { DatabaseModule } from "src/database/database.module";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
    ],
    exports: [],
    controllers: [TransactionController],
    providers: [JwtService, TransactionService]  
})

export class TransactionModule { }