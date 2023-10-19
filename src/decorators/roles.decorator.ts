import { SetMetadata } from '@nestjs/common';
import { AppRoles } from 'src/api-key/api-key.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AppRoles[]) => SetMetadata(ROLES_KEY, roles);
