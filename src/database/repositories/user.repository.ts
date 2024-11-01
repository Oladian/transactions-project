import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../core/domain/interfaces/user.repository.interface";
import { User } from "../../core/domain/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) {}

    async save(user: User): Promise<User> {
        return await this.repository.save(user);
    }

    async findById(id: string): Promise<User | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findByUsername(username: string): Promise<User | null> {
        return await this.repository.findOne({ where: { username } });
    }
}