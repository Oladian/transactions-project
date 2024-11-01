import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { User } from "src/core/domain/entities/user.entity";
import { AuthPayloadDto } from "./dto/authPayload.dto";
import { UserRepository } from "src/database/repositories/user.repository";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userRepository: UserRepository) { }
    async validateUser({ username, password }: AuthPayloadDto) {
        const user = await this.userRepository.findByUsername(username);

        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async login(user: User) {
        const payload = { username: user.username, sub: user.id, role: user.role }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}