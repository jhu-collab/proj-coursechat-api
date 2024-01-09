import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpResponseFilter } from './filters/http-response.filter';
import { HttpResponseInterceptor } from './interceptors/http-response.interceptor';
import helmet from 'helmet';
import { setupSwagger } from './config/swagger.config';
import { initAdminApiKey } from './api-key/api-keys.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'log', 'verbose', 'debug'],
    logger: ['error', 'warn', 'log'],
    snapshot: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpResponseFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.use(helmet());
  app.enableCors();

  setupSwagger(app);

  await initAdminApiKey(app);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}

bootstrap();
