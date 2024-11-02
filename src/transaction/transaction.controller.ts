import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from "src/auth/guards/auth.guard";
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Transaction } from "src/core/domain/entities/transaction.entity";
import { TransactionStatus } from "src/core/domain/enums/transactionStatus.enum";
import { UserRole } from "src/core/domain/enums/userRole.enum";
import { Roles } from "src/shared/decorators/roles.decorator";
import { TransactionService } from "./transaction.service";

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionController {
    constructor(private transactionService: TransactionService) { }

    @Post('request')
    @UseGuards(AuthGuard)
    async requestTransaction(@Request() req, @Body('amount') amount: number): Promise<Transaction> {
        const transaction = new Transaction();
        transaction.transactionAmount = amount;
        transaction.userId = req.user.userId;

        return this.transactionService.requestTransaction(transaction);
    }

    @Get('pending')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    getPendingTransactions() {
        return this.transactionService.getPendingTransactions();
    }

    @Put('validate/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: TransactionStatus
    ) {
        return this.transactionService.validateTransaction(id, status);
    }

    @Get('find/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getTransaction(@Param('id') id: string): Promise<Transaction> {
        return this.transactionService.getTransactionById(id);
    }
}