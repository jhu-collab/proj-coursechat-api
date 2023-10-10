import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { MessageService } from 'src/message/message.service';
import { AssistantManagerService } from 'src/ai-services/assistant-manager.service';
import { StartConversationDTO } from './dto/start-conversation.dto';
import { ConversationResponseDTO } from './dto/conversation-response.dto';
import { ContinueConversationDTO } from './dto/continue-conversation.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Message } from 'src/message/message.entity';
import { Chat } from 'src/chat/chat.entity';

@Injectable()
export class ConversationService {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly assistantManagerService: AssistantManagerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllConversations(limit: number, offset: number): Promise<Chat[]> {
    return this.chatService.findAll(undefined, limit, offset);
  }

  async getAllMessagesInConversation(
    chatId: number,
    limit?: number,
    offset?: number,
  ): Promise<Message[]> {
    return this.messageService.findAll(chatId, limit, offset);
  }

  async startConversation(
    startConversationDto: StartConversationDTO,
  ): Promise<ConversationResponseDTO> {
    try {
      const { message, ...createChatDto } = startConversationDto;
      const chat = await this.chatService.create({
        ...createChatDto,
      });

      await this.messageService.create(chat.id, {
        content: message,
        role: 'user',
      });

      // Generate response using the associated assistant
      const response = await this.assistantManagerService.generateResponse(
        startConversationDto.assistantName,
        message,
      );

      if (!response) {
        throw new InternalServerErrorException(
          'Failed to generate AI response.',
        );
      }

      // Save the AI's response as a new message linked to the same chat
      await this.messageService.create(chat.id, {
        content: response,
        role: 'assistant',
      });

      return {
        chatId: chat.id,
        response,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to start a conversation.',
        error.message,
      );
    }
  }

  async continueConversation(
    chatId: number,
    continueConversationDto: ContinueConversationDTO,
  ): Promise<ConversationResponseDTO> {
    const { message } = continueConversationDto;

    try {
      await this.messageService.create(chatId, {
        content: message,
        role: 'user',
      });

      // Check if assistantName is in the cache
      let assistantName = await this.cacheManager.get<string>(
        `chat-${chatId}-assistantName`,
      );

      // If not in the cache, fetch from the database and store in the cache
      if (!assistantName) {
        const chat = await this.chatService.findOne(chatId);
        assistantName = chat.assistantName;
        await this.cacheManager.set(
          `chat-${chatId}-assistantName`,
          assistantName,
          3600, // cache for 1 hour, adjust as needed
        );
      }

      // Generate response using the associated assistant
      const response = await this.assistantManagerService.generateResponse(
        assistantName,
        message,
      );

      if (!response) {
        throw new InternalServerErrorException(
          'Failed to generate AI response.',
        );
      }

      // Save the AI's response as a new message linked to the same chat
      await this.messageService.create(chatId, {
        content: response,
        role: 'assistant',
      });

      return {
        chatId,
        response,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to continue a conversation.',
        error.message,
      );
    }
  }

  async updateConversationTitle(
    chatId: number,
    newTitle: string,
  ): Promise<Chat> {
    return this.chatService.updatePartial(chatId, {
      title: newTitle,
    });
  }

  async deleteConversation(chatId: number): Promise<void> {
    await this.chatService.delete(chatId);
  }
}
