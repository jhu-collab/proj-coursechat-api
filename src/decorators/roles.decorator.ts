import { SetMetadata } from '@nestjs/common';
import { ApiKeyRoles } from 'src/api-key/api-key-roles.enum';

export const ROLES_KEY = 'roles';

/**
 * Custom decorator for assigning roles to route handlers.
 *
 * This decorator uses NestJS's `SetMetadata` to associate the specified roles with a route.
 * It can be used for role-based access control, in conjunction with guards that check these roles.
 *
 * The roles are defined in the `ApiKeyRoles` enum, and this decorator allows specifying one or more roles
 * that are required to access the route.
 *
 * Usage:
 * Apply this decorator to controller methods to restrict access based on user roles.
 *
 * @example
 * ```
 * @Get('/protected-route')
 * @Roles(ApiKeyRoles.ADMIN, ApiKeyRoles.USER)
 * handleProtectedRoute() {
 *   // Controller logic for a route accessible only to users with ADMIN or USER roles...
 * }
 * ```
 *
 * @param {...ApiKeyRoles[]} roles - The roles required to access the route.
 * @returns {DecoratorFunction} - A custom decorator function for setting metadata on the route.
 */
export const Roles = (...roles: ApiKeyRoles[]) => SetMetadata(ROLES_KEY, roles);
