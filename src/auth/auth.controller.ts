import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthPayloadDto } from "./dto/authPayload.dto";
import { LocalGuard } from "./guards/local.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalGuard)
    login(@Body() authPayload: AuthPayloadDto) {
        const user = this.authService.validateUser(authPayload);
        return user;
    }
}