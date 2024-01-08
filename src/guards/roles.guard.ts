import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKey } from 'src/api-key/api-key.entity';
import { ApiKeyRoles } from 'src/api-key/api-key-roles.enum';

/**
 * A guard that checks if the incoming request has an API key with the required roles.
 *
 * This guard uses role-based access control to determine if the request can proceed to the route handler.
 * It works by checking the roles associated with the API key of the request against the roles required by the route.
 * The required roles for a route are defined using custom decorators.
 *
 * @implements {CanActivate}
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  /**
   * Constructs a new RolesGuard instance.
   *
   * @param {Reflector} reflector - A helper class provided by NestJS to access route metadata, such as roles.
   */
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current user has the required roles to access a route.
   * The roles are specified in route handlers using custom decorators.
   * If no roles are required for the route, access is granted.
   * Otherwise, the API key entity attached to the request is checked for the required roles.
   *
   * @param {ExecutionContext} context - The execution context of the request in the NestJS application.
   * @returns {boolean} - True if the user has the required roles or if no roles are required; false otherwise.
   */
  canActivate(context: ExecutionContext): boolean {
    this.logger.verbose('Checking user roles for route access...');

    const requiredRoles = this.reflector.getAllAndOverride<ApiKeyRoles[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      this.logger.verbose('No specific roles required for this route');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKeyEntity: ApiKey = request.apiKeyEntity;

    if (!apiKeyEntity) {
      this.logger.warn('API key entity not found in the request');
      return false;
    }

    const isMatch = requiredRoles.some((role) => role === apiKeyEntity.role);

    if (isMatch) {
      this.logger.verbose(`User has required role(s): ${requiredRoles}`);
    } else {
      this.logger.warn(`User does not have required role(s): ${requiredRoles}`);
    }

    return isMatch;
  }
}
