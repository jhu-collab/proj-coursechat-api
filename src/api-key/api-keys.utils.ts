import { ApiKeyService } from './api-key.service';
import { ApiKeyRoles } from './api-key-roles.enum';
import { INestApplication, Logger } from '@nestjs/common';

/**
 * Initializes the admin API key if it does not exist.
 * @param app The NestJS application instance.
 */
export async function initAdminApiKey(app: INestApplication) {
  const logger = new Logger('initAdminApiKey');

  try {
    const apiKeyService = app.get(ApiKeyService);
    const adminKey = await apiKeyService.findByRole(ApiKeyRoles.ADMIN);
    if (adminKey.length === 0) {
      logger.log('No admin API key found. Creating one...');
      await apiKeyService.create({
        description: 'Automatically generated admin API key',
        role: ApiKeyRoles.ADMIN,
      });
      logger.log('Admin API key created.');
    }
  } catch (error) {
    logger.error('Error checking/creating admin API key', error.stack);
  }
}
