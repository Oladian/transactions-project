import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./../../../../src/core/domain/entities/user.entity";
import { IUserRepository } from "./../../../../src/core/domain/interfaces/user.repository.interface";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) { }

    async save(user: User): Promise<User> {
        const createUser = this.repository.create(user);

        return this.repository.save(createUser);
    }

    async findByUsername(username: string): Promise<User | null> {
        return await this.repository.findOne({ where: { username } });
    }
}
