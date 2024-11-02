
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthGuard } from '../src/auth/guards/auth.guard';

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    let jwtService: JwtService;

    beforeEach(() => {
        jwtService = new JwtService({ secret: 'testSecret' });
        authGuard = new AuthGuard(jwtService);
    });

    it('should be defined', () => {
        expect(authGuard).toBeDefined();
    });

    describe('canActivate', () => {
        let mockContext: ExecutionContext;
        let mockRequest: Partial<Request>;

        beforeEach(() => {
            mockRequest = {
                headers: {
                    authorization: 'Bearer validToken',
                },
            };
            mockContext = {
                switchToHttp: () => ({
                    getRequest: () => mockRequest,
                }),
            } as unknown as ExecutionContext;
        });

        it('should return true when token is valid', async () => {
            jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce({ userId: 1 });

            const result = await authGuard.canActivate(mockContext);

            expect(result).toBe(true);
            expect(mockRequest['user']).toEqual({ userId: 1 });
        });

        it('should throw UnauthorizedException if token is missing', async () => {
            mockRequest.headers.authorization = '';

            await expect(authGuard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if token is invalid', async () => {
            jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error('Invalid token'));

            await expect(authGuard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('extractTokenFromHeader', () => {
        it('should extract token when authorization header is valid', () => {
            const request = {
                headers: {
                    authorization: 'Bearer testToken',
                },
            } as Request;

            const token = (authGuard as any).extractTokenFromHeader(request);

            expect(token).toBe('testToken');
        });

        it('should return undefined when authorization header is missing', () => {
            const request = {
                headers: {},
            } as Request;

            const token = (authGuard as any).extractTokenFromHeader(request);

            expect(token).toBeUndefined();
        });

        it('should return undefined when authorization type is not Bearer', () => {
            const request = {
                headers: {
                    authorization: 'Basic testToken',
                },
            } as Request;

            const token = (authGuard as any).extractTokenFromHeader(request);

            expect(token).toBeUndefined();
        });
    });
});