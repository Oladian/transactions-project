import { EntityBase } from "./../../../../src/core/domain/entities/entity.base";
import { Column, Entity } from "typeorm";
import { UserRole } from "../enums/userRole.enum";

@Entity('user')
export class User extends EntityBase {

    @Column()
    password: string;

    @Column({ unique: true })
    username: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;
}