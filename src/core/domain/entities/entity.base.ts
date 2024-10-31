import { BeforeInsert, PrimaryColumn } from "typeorm";
import { ulid } from 'ulid';

export abstract class EntityBase {
    @PrimaryColumn({
        type: 'varchar',
        length: 36,
    })
    id: string;

    @BeforeInsert()
    generateId() {
        this.id = ulid();
    }
}

