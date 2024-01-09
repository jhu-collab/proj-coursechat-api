import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Sets up Swagger for the given NestJS application.
 * @param app The NestJS application instance.
 */
export function setupSwagger(app: INestApplication) {
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
}
