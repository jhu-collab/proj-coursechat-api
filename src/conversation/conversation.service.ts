import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { MessageService } from 'src/message/message.service';
import { AssistantManagerService } from 'src/ai-services/assistant-manager.service';
import { StartConversationDTO } from './dto/start-conversation.dto';
import { ConversationResponseDTO } from './dto/conversation-response.dto';
import { ContinueConversationDTO } from './dto/continue-conversation.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Message, MessageRoles } from 'src/message/message.entity';
import { Chat } from 'src/chat/chat.entity';

@Injectable()
export class ConversationService {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly assistantManagerService: AssistantManagerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllConversations(
    search?: string,
    limit?: number,
    offset?: number,
    apiKeyId?: number,
  ): Promise<Chat[]> {
    return this.chatService.findAll(search, limit, offset, apiKeyId);
  }

  async getAllMessagesInConversation(
    chatId: number,
    search?: string,
    limit?: number,
    offset?: number,
    apiKeyId?: number,
  ): Promise<Message[]> {
    await this.chatService.findOne(chatId, apiKeyId); // throws NotFoundException if not found
    return this.messageService.findAll(chatId, search, limit, offset);
  }

  async startConversation(
    apiKeyId: number,
    startConversationDto: StartConversationDTO,
  ): Promise<ConversationResponseDTO> {
    try {
      const { message, ...createChatDto } = startConversationDto;
      const chat = await this.chatService.create(apiKeyId, createChatDto);

      await this.messageService.create(chat.id, {
        content: message,
        role: MessageRoles.USER,
      });

      // Generate response using the associated assistant
      const response = await this.assistantManagerService.generateResponse(
        chat.assistantName,
        message,
        chat.id, // Pass chat.id as chatId
      );

      if (!response) {
        throw new InternalServerErrorException(
          'Failed to generate AI response.',
        );
      }

      // Save the AI's response as a new message linked to the same chat
      await this.messageService.create(chat.id, {
        content: response,
        role: MessageRoles.ASSISTANT,
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
    apiKeyId?: number,
  ): Promise<ConversationResponseDTO> {
    // Try to get the chat from cache
    const chatCacheKey = `chat_${chatId}`;
    let chat = await this.cacheManager.get<Chat>(chatCacheKey);

    if (!chat) {
      chat = await this.chatService.findOne(chatId, apiKeyId); // throws NotFoundException if not found
      // Store the fetched chat in cache with an expiration time (60 minutes)
      await this.cacheManager.set(chatCacheKey, chat, 3600);
    } else if (apiKeyId) {
      if (chat.apiKeyId !== apiKeyId) {
        throw new NotFoundException(
          `Chat with ID ${chatId} not found for API Key ${apiKeyId}`,
        );
      }
    }

    const { message } = continueConversationDto;

    try {
      await this.messageService.create(chatId, {
        content: message,
        role: MessageRoles.USER,
      });

      // Generate response using the associated assistant
      const response = await this.assistantManagerService.generateResponse(
        chat.assistantName,
        message,
        chatId,
      );

      if (!response) {
        throw new InternalServerErrorException(
          'Failed to generate AI response.',
        );
      }

      // Save the AI's response as a new message linked to the same chat
      await this.messageService.create(chatId, {
        content: response,
        role: MessageRoles.ASSISTANT,
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
    apiKeyId?: number,
  ): Promise<Chat> {
    return this.chatService.update(
      chatId,
      {
        title: newTitle,
      },
      apiKeyId,
    );
  }

  async deleteConversation(chatId: number, apiKeyId?: number): Promise<void> {
    await this.chatService.delete(chatId, apiKeyId);
  }
}
