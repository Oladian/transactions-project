import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { User } from "src/core/domain/entities/user.entity";
import { UserRepository } from "src/database/repositories/user/user.repository";
import { AuthPayloadDto } from "./dto/authPayload.dto";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userRepository: UserRepository) { }

    async validateUser({ username, password }: AuthPayloadDto): Promise<User> {

        const user = await this.userRepository.findByUsername(username);

        if (user && await bcrypt.compareSync(password, user.password)) {

            return user;
        }

        throw new UnauthorizedException();
    }

    async authenticate({ username, password }: AuthPayloadDto): Promise<{ access_token: string }> {

        const user = await this.validateUser({ username, password });

        const payload = { username: user.username, userId: user.id, role: user.role };

        return {
            access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
        };
    }

    async createUser(user: User) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;

        return await this.userRepository.save(user);
    }
}
