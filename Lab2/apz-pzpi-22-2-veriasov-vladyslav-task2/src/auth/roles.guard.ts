import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true; // Если роли не указаны, доступ открыт
        }

        const { user } = context.switchToHttp().getRequest();
        console.log(user.role);
        if (!user || !user.role || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Access denied: insufficient permissions');
        }

        return true;
    }
}
