import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpResponseFilter } from './filters/http-response.filter';
import { HttpResponseInterceptor } from './interceptors/http-response.interceptor';
import helmet from 'helmet';
import { ApiKeyService } from './api-key/api-key.service';
import { AppRoles } from './api-key/api-key.entity';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpResponseFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.use(helmet());
  app.enableCors();

  // Set up Swagger options
  const options = new DocumentBuilder()
    .setTitle('CourseChat API') // Your API title
    .setDescription(
      'CourseChat is an interactive platform designed to assist students in comprehending their course material.',
    )
    .setVersion('1.0')
    .addTag(
      'Health Check',
      'Default endpoint to check if the API is up and running',
    )
    .addTag('Assistants', 'Endpoints related to AI assistants')
    .addTag(
      'API Keys',
      'Endpoints related to API key management 🚫 [Admins Only]',
    )
    .addTag('Chats', 'Endpoints related to chat management 🚫 [Admins Only]')
    .addTag(
      'Messages',
      'Endpoints related to message management 🚫 [Admins Only]',
    )
    .addTag('Conversations', 'Endpoints related to conversation management')
    .addSecurity('apiKey', {
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document); // 'api-docs' is the route to Swagger UI

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
