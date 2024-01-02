import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKey } from 'src/api-key/api-key.entity';
import { ApiKeyRoles } from 'src/api-key/api-key-roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ApiKeyRoles[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKeyEntity: ApiKey = request.apiKeyEntity;

    if (!apiKeyEntity) {
      return false;
    }

    // Check if one of the required roles matches the user's role
    const isMatch = requiredRoles.some((role) => role === apiKeyEntity.role);
    return isMatch;
  }
}
