import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    validate(username: string, password: string) {
        const user = this.authService.validateUser({username, password});
        if (!user) throw new UnauthorizedException();
        return user;
    }
}