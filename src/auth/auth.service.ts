import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { User } from "src/core/domain/entities/user.entity";
import { UserRepository } from "src/database/repositories/user/user.repository";
import { AuthPayloadDto } from "./dto/authPayload.dto";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userRepository: UserRepository) { }

    async validateUser({ username, password }: AuthPayloadDto) {

        const user = await this.userRepository.findByUsername(username);

        if (user && await bcrypt.compareSync(password, user.password)) {

            return user;
        }

        throw new UnauthorizedException();
    }

    async login(user: User) {
        const payload = { username: user.username, sub: user.id, role: user.role };

        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async createUser(user: User) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;

        return await this.userRepository.save(user);
    }
}
