import {
    Body,
    Controller,
    Post
} from '@nestjs/common';
import { User } from "src/core/domain/entities/user.entity";
import { AuthService } from "./auth.service";
import { AuthPayloadDto } from "./dto/authPayload.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() authPayload: AuthPayloadDto) {
        const user = this.authService.authenticate(authPayload);

        return user;
    }

    @Post('create')
    async create(@Body() user: User): Promise<User> {
        return await this.authService.createUser(user);
    }
}
