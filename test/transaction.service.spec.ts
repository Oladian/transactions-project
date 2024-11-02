import { Test, TestingModule } from '@nestjs/testing';
import { Transaction } from './../src/core/domain/entities/transaction.entity';
import { TransactionStatus } from './../src/core/domain/enums/transactionStatus.enum';
import { TransactionRepository } from './../src/database/repositories/transaction/transaction.repository';
import { TransactionService } from './../src/transaction/transaction.service';

describe('TransactionService', () => {
    let transactionService: TransactionService;
    let transactionRepository: TransactionRepository;

    const mockTransactionRepository = {
        save: jest.fn(),
        updateStatus: jest.fn(),
        findById: jest.fn(),
        findAllPending: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionService,
                {
                    provide: TransactionRepository,
                    useValue: mockTransactionRepository,
                },
            ],
        }).compile();

        transactionService = module.get<TransactionService>(TransactionService);
        transactionRepository = module.get<TransactionRepository>(TransactionRepository);
    });

    it('should be defined', () => {
        expect(transactionService).toBeDefined();
    });

    describe('requestTransaction', () => {
        it('should save a transaction and return it', async () => {
            const transaction: Transaction = {
                transactionAmount: 0,
                status: TransactionStatus.PENDING,
                userId: '',
                id: '',
                generateId: jest.fn()
            };
            const savedTransaction = { ...transaction, id: '1' };

            mockTransactionRepository.save.mockResolvedValue(savedTransaction);

            const result = await transactionService.requestTransaction(transaction);

            expect(transactionRepository.save).toHaveBeenCalledWith(transaction);
            expect(result).toEqual(savedTransaction);
        });
    });

    describe('validateTransaction', () => {
        it('should update the transaction status', async () => {
            const transactionId = '1';
            const status = TransactionStatus.APPROVED;

            await transactionService.validateTransaction(transactionId, status);

            expect(transactionRepository.updateStatus).toHaveBeenCalledWith(transactionId, status);
        });
    });

    describe('getTransactionById', () => {
        it('should return a transaction by id', async () => {
            const transactionId = '1';
            const transaction: Transaction = {
                transactionAmount: 0,
                status: TransactionStatus.PENDING,
                userId: '',
                id: '',
                generateId: jest.fn()
            };

            mockTransactionRepository.findById.mockResolvedValue(transaction);

            const result = await transactionService.getTransactionById(transactionId);

            expect(transactionRepository.findById).toHaveBeenCalledWith(transactionId);
            expect(result).toEqual(transaction);
        });
    });

    describe('getPendingTransactions', () => {
        it('should return all pending transactions', async () => {
            const transaction1: Transaction = {
                transactionAmount: 0,
                status: TransactionStatus.PENDING,
                userId: '',
                id: '',
                generateId: jest.fn()
            };
            const transaction2: Transaction = {
                transactionAmount: 0,
                status: TransactionStatus.PENDING,
                userId: '',
                id: '',
                generateId: jest.fn()
            };
            
            const pendingTransactions: Transaction[] = [transaction1, transaction2];

            mockTransactionRepository.findAllPending.mockResolvedValue(pendingTransactions);

            const result = await transactionService.getPendingTransactions();

            expect(transactionRepository.findAllPending).toHaveBeenCalled();
            expect(result).toEqual(pendingTransactions);
        });
    });
});