import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { DatabaseModule } from "src/database/database.module";
import { LocalStrategy } from "./local.strategy";

@Module({
    imports: [
        DatabaseModule,
        PassportModule,
        JwtModule.register({
            secret: 'secret',
            signOptions: { expiresIn: '1h' }
        })
    ],
    exports: [],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy]
})
export class AuthModule { }