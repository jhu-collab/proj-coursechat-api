import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Chat } from './chat/chat.entity';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { Message } from './message/message.entity';
import { ApiKeyService } from './api-key/api-key.service';
import { ApiKeyController } from './api-key/api-key.controller';
import { ApiKey } from './api-key/api-key.entity';
import { AssistantService } from './assistant/assistant.service';
import { AssistantController } from './assistant/assistant.controller';
import { Assistant } from './assistant/assistant.entity';
import { ExtractApiKeyMiddleware } from './middleware/extract-api-key.middleware';
import { AssistantModule } from './assistant/assistant.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
    }),
    AssistantModule,
    ConfigModule.forRoot(), // Load the .env file
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Chat, Message, ApiKey, Assistant]),
  ],
  controllers: [
    AppController,
    ChatController,
    MessageController,
    ApiKeyController,
    AssistantController,
  ],
  providers: [
    AppService,
    ChatService,
    MessageService,
    ApiKeyService,
    AssistantService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractApiKeyMiddleware)
      .forRoutes(
        { path: '/chats', method: RequestMethod.ALL },
        { path: '/chats/*', method: RequestMethod.ALL },
        { path: '/messages', method: RequestMethod.ALL },
        { path: '/messages/*', method: RequestMethod.ALL },
      );
  }
}
