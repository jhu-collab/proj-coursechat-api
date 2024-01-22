import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { ConversationController } from './conversation/conversation.controller';
import { AssistantManagerService } from './ai-services/assistant-manager.service';
import { ParrotService } from './ai-services/assistant-01-parrot.service';
import { DoryService } from './ai-services/assistant-02-dory.service';
import { BloomService } from './ai-services/bloom.service';
import { ElephantService } from './ai-services/assistant-03-elephant.service';
import { MementoService } from './ai-services/assistant-04-memento.service';
import { FinchService } from './ai-services/assistant-05-finch.service';
import { validate } from './env.validation';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
      port: parseInt(process.env.DEVTOOLS_PORT) || 3001,
    }),
    CacheModule.register({
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
    }),
    ConfigModule.forRoot({
      validate, // Validate the .env file
    }), // Loads the .env file
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
    ConversationController,
  ],
  providers: [
    AppService,
    ChatService,
    MessageService,
    ApiKeyService,
    AssistantService,
    AssistantManagerService,
    ParrotService,
    DoryService,
    BloomService,
    ElephantService,
    MementoService,
    FinchService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractApiKeyMiddleware)
      .forRoutes(
        { path: '/api-keys', method: RequestMethod.ALL },
        { path: '/api-keys/*', method: RequestMethod.ALL },
        { path: '/assistants', method: RequestMethod.ALL },
        { path: '/assistants/*', method: RequestMethod.ALL },
        { path: '/chats', method: RequestMethod.ALL },
        { path: '/chats/*', method: RequestMethod.ALL },
        { path: '/messages', method: RequestMethod.ALL },
        { path: '/messages/*', method: RequestMethod.ALL },
        { path: '/conversations', method: RequestMethod.ALL },
        { path: '/conversations/*', method: RequestMethod.ALL },
      );
  }
}
