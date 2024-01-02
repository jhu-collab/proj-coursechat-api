import { SetMetadata } from '@nestjs/common';
import { ApiKeyRoles } from 'src/api-key/api-key-roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ApiKeyRoles[]) => SetMetadata(ROLES_KEY, roles);
