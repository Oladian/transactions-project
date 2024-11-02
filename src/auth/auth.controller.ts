import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthPayloadDto } from "./dto/authPayload.dto";
import { LocalGuard } from "./guards/local.guard";
import { User } from "src/core/domain/entities/user.entity";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalGuard)
    asynclogin(@Body() authPayload: AuthPayloadDto) {
        const user = this.authService.validateUser(authPayload);

        return user;
    }

    @Post('create')
    async create(@Body() user: User) {

        return await this.authService.createUser(user);
    }
}
