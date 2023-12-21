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
import { ConversationService } from './conversation/conversation.service';
import { ConversationController } from './conversation/conversation.controller';
import { AssistantManagerService } from './ai-services/assistant-manager.service';
import { ParrotService } from './ai-services/parrot.service';
import { DoryService } from './ai-services/dory.service';
import { Gpt4Service } from './ai-services/gpt-4.service';
import { BloomService } from './ai-services/bloom.service';
import { ElephantService } from './ai-services/elephant.service';
import { MementoService } from './ai-services/memento.service';
import { FinchService } from './ai-services/finch.service';
import { ZebraService } from './ai-services/zebra.service';
import { AntService } from './ai-services/ant.service';
import { AntEaterService } from './ai-services/ant-eater.service';
import { AntEaterPlusService } from './ai-services/ant-eater-plus.service';
import { AntEaterPlusPlusService } from './ai-services/ant-eater-plus-plus.service';
import { BadgerService } from './ai-services/badger.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
    }),
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
    ConversationController,
  ],
  providers: [
    AppService,
    ChatService,
    MessageService,
    ApiKeyService,
    AssistantService,
    ConversationService,
    AssistantManagerService,
    ParrotService,
    DoryService,
    Gpt4Service,
    BloomService,
    ElephantService,
    MementoService,
    FinchService,
    ZebraService,
    AntService,
    AntEaterService,
    AntEaterPlusService,
    AntEaterPlusPlusService,
    BadgerService,
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
