import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
    TypeOrmModule.forFeature([Chat, Message, ApiKey]),
  ],
  controllers: [
    AppController,
    ChatController,
    MessageController,
    ApiKeyController,
  ],
  providers: [AppService, ChatService, MessageService, ApiKeyService],
})
export class AppModule {}
