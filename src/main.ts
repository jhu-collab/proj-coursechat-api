import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpResponseFilter } from './filters/http-response.filter';
import { HttpResponseInterceptor } from './interceptors/http-response.interceptor';
import helmet from 'helmet';
import { ApiKeyService } from './api-key/api-key.service';
import { AppRoles } from './api-key/api-key.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpResponseFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.use(helmet());
  app.enableCors();

  try {
    const apiKeyService = app.get(ApiKeyService);
    const adminKey = await apiKeyService.findByRole(AppRoles.ADMIN);
    if (!adminKey) {
      logger.log('No admin API key found. Creating one...');
      await apiKeyService.create({
        description: 'Automatically generated admin API key',
        role: AppRoles.ADMIN,
      });
      logger.log('Admin API key created.');
    }
  } catch (error) {
    logger.error('Error checking/creating admin API key', error.stack);
  }

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}

bootstrap();
