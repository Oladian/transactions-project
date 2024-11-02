import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../src/core/domain/enums/userRole.enum';
import { RolesGuard } from '../src/auth/guards/roles.guard';

describe('RolesGuard', () => {
    let rolesGuard: RolesGuard;
    let reflector: Reflector;

    beforeEach(() => {
        reflector = new Reflector();
        rolesGuard = new RolesGuard(reflector);
    });

    it('should be defined', () => {
        expect(rolesGuard).toBeDefined();
    });

    describe('canActivate', () => {
        let mockContext: ExecutionContext;

        beforeEach(() => {
            mockContext = {
                switchToHttp: jest.fn().mockReturnValue({
                    getRequest: jest.fn().mockReturnValue({
                        user: { role: [UserRole.ADMIN] },
                    }),
                }),
                getHandler: jest.fn(),
                getClass: jest.fn(),
            } as unknown as ExecutionContext;
        });

        it('should return true if no roles are required', () => {
            jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

            const result = rolesGuard.canActivate(mockContext);

            expect(result).toBe(true);
        });

        it('should return true if user has the required role', () => {
            jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

            const result = rolesGuard.canActivate(mockContext);

            expect(result).toBe(true);
        });

        it('should return false if user does not have the required role', () => {
            jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.USER]);

            const result = rolesGuard.canActivate(mockContext);

            expect(result).toBe(false);
        });
    });
});