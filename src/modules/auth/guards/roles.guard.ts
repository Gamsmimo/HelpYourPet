import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    const normalizedRequiredRoles = requiredRoles.map((role) => role.toUpperCase());
    const normalizedUserRole = (user.nombreRol || '').toUpperCase();

    // Respaldo por idRol para evitar fallos por capitalizacion o tokens antiguos
    const roleById: Record<number, string> = {
      1: 'ADMIN',
      2: 'VETERINARIO',
      3: 'USUARIO',
    };
    const normalizedUserRoleById = roleById[Number(user.idRol)] || '';

    return normalizedRequiredRoles.some(
      (requiredRole) =>
        normalizedUserRole === requiredRole || normalizedUserRoleById === requiredRole,
    );
  }
}
