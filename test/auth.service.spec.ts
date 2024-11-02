
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './../src/auth/auth.service';
import { AuthPayloadDto } from './../src/auth/dto/authPayload.dto';
import { User } from './../src/core/domain/entities/user.entity';
import { UserRole } from './../src/core/domain/enums/userRole.enum';
import { UserRepository } from './../src/database/repositories/user/user.repository';

jest.mock('bcryptjs', () => ({
    compareSync: jest.fn().mockReturnValue(true),
    genSalt: jest.fn().mockResolvedValue('salt'),
    hash: jest.fn().mockResolvedValue('hashedpassword'),
}));

describe('AuthService', () => {
    let authService: AuthService;
    let jwtService: JwtService;
    let userRepository: UserRepository;

    beforeEach(() => {
        jwtService = new JwtService({ secret: 'testSecret' });
        userRepository = {
            findByUsername: jest.fn(),
            save: jest.fn(),
        } as unknown as UserRepository;
        authService = new AuthService(jwtService, userRepository);
    });

    describe('validateUser', () => {
        it('should return user if username and password are valid', async () => {
            const mockUser = { username: 'testuser', password: 'hashedpassword' } as User;
            const authPayload: AuthPayloadDto = { username: 'testuser', password: 'password' };

            jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

            const result = await authService.validateUser(authPayload);

            expect(result).toBe(mockUser);
        });

        it('should throw UnauthorizedException if user is not found', async () => {
            const authPayload: AuthPayloadDto = { username: 'invaliduser', password: 'password' };

            jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);

            await expect(authService.validateUser(authPayload)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            const mockUser = { username: 'testuser', password: 'hashedpassword' } as User;
            const authPayload: AuthPayloadDto = { username: 'testuser', password: 'wrongpassword' };

            jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

            await expect(authService.validateUser(authPayload)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('authenticate', () => {
        it('should return access token if username and password are valid', async () => {
            const mockUser = { username: 'testuser', id: 1, role: 'user', password: 'hashedpassword' } as unknown as User;
            const authPayload: AuthPayloadDto = { username: 'testuser', password: 'password' };
            const mockToken = 'mockAccessToken';

            jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

            const result = await authService.authenticate(authPayload);

            expect(result).toEqual({ access_token: mockToken });
        });
    });

    describe('createUser', () => {
        it('should hash password and save user', async () => {         
            const mockUser = { username: 'testuser',
                password: 'hashedpassword',
                role: UserRole.USER,
                id: '1',
                generateId: jest.fn(),
            } as User;
            const hashedPassword = 'hashedpassword';

            jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
            jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
            jest.spyOn(userRepository, 'save').mockResolvedValue({ ...mockUser, generateId: jest.fn(), password: hashedPassword });

            const result = await authService.createUser(mockUser);

            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 'salt');
            expect(userRepository.save).toHaveBeenCalledWith({ ...mockUser, password: hashedPassword });
            expect(result.password).toBe(hashedPassword);
        });
    });
});