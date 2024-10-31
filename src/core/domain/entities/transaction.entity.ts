import { EntityBase } from "src/core/domain/entities/entity.base";
import { Column, Entity, ManyToOne } from "typeorm";
import { TransactionStatus } from "../enums/transactionStatus.enum";
import { User } from "./user.entity";

@Entity('transaction')
export class Transaction extends EntityBase {

    @Column()
    transactionAmount: number;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    })
    status: TransactionStatus

    @ManyToOne(() => User, (user) => user.id)
    user: User;
}