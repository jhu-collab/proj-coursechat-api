import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  Res,
} from '@nestjs/common';
import { StartConversationDTO } from './conversation-start.dto';
import { ContinueConversationDTO } from './conversation-continue.dto';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { ApiKeyEntity } from 'src/decorators/api-key.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiKey } from 'src/api-key/api-key.entity';
import { ApiKeyRoles } from 'src/api-key/api-key-roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { ChatResponseDTO } from 'src/chat/chat-response.dto';
import { ApiOkResponseWithWrapper } from 'src/decorators/api-ok-response-wrapper.decorator';
import { CommonApiResponses } from 'src/decorators/common-api-responses.decorator';
import { FindChatsQueryDTO } from 'src/chat/chat-find-query.dto';
import { FindChatsResponseDTO } from 'src/chat/chat-find-response.dto';
import { Chat } from 'src/chat/chat.entity';
import { ChatService } from 'src/chat/chat.service';
import { MessageService } from 'src/message/message.service';
import { AssistantManagerService } from 'src/ai-services/assistant-manager.service';
import { FindMessagesResponseDTO } from 'src/message/message-find-response.dto';
import { FindMessagesQueryDTO } from 'src/message/message-find-query.dto';
import { MessageRoles } from 'src/message/message-roles.enum';
import { UpdateChatDTO } from 'src/chat/chat-update.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { DefaultPaginationInterceptor } from 'src/interceptors/default-pagination.interceptor';
import { Response } from 'express';
import { IterableReadableStreamInterface } from 'src/ai-services/assistant-00-base.service';
import OpenAI from 'openai';
// import { OpenAi } from openai;

@ApiTags('Conversations')
@CommonApiResponses()
@ApiSecurity('apiKey')
@Controller('conversations')
@UseGuards(ApiKeyGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ConversationController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly assistantManagerService: AssistantManagerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @Roles(ApiKeyRoles.ADMIN, ApiKeyRoles.CLIENT)
  @ApiOperation({
    summary:
      'Fetch all conversations for an API key or all conversations for ADMIN',
  })
  @ApiQuery({
    type: FindChatsQueryDTO,
  })
  @ApiOkResponseWithWrapper({
    description: 'List of conversations (chats)',
    status: 200,
    type: FindChatsResponseDTO,
  })
  @UseInterceptors(DefaultPaginationInterceptor)
  async findAllConversation(
    @ApiKeyEntity() apiKey: ApiKey,
    @Query() query: FindChatsQueryDTO,
  ): Promise<FindChatsResponseDTO> {
    const chats: Chat[] = await this.chatService.findAll(query);

    return {
      ...query,
      data: chats,
    };
  }

  @Get(':chatId/messages')
  @Roles(ApiKeyRoles.ADMIN, ApiKeyRoles.CLIENT)
  @ApiOperation({
    summary: 'Retrieve all messages within a specific conversation (chat)',
  })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @ApiQuery({ type: FindMessagesQueryDTO })
  @ApiOkResponseWithWrapper({
    description: 'List of messages',
    status: 200,
    type: FindMessagesResponseDTO,
  })
  async findAllMessagesInOneConversation(
    @ApiKeyEntity() apiKey: ApiKey,
    @Param('chatId') chatId: string,
    @Query() query: FindMessagesQueryDTO,
  ): Promise<FindMessagesResponseDTO> {
    const apiKeyId = apiKey.role === ApiKeyRoles.CLIENT ? apiKey.id : undefined;
    const { limit, offset, search } = query;
    const chat = await this.chatService.findOne(chatId, apiKeyId);

    if (!chat) {
      throw new NotFoundException(
        `Chat with ID ${chatId} not found for API Key ${apiKeyId}`,
      );
    }

    const messages = await this.messageService.findAll({
      limit,
      offset,
      search,
      chatId,
    });

    return {
      ...query,
      data: messages,
    };
  }

  @Post('start')
  @Roles(ApiKeyRoles.ADMIN, ApiKeyRoles.CLIENT)
  @ApiOperation({
    summary: 'Initiate a new conversation and get the initial AI response',
  })
  @ApiBody({ type: StartConversationDTO })
  // TODO: Add proper swagger documentation here (given the output changes based on stream flag)
  // @ApiOkResponseWithWrapper({
  //   description:
  //     'Chat created successfully, message stored and AI response sent back',
  //   status: 201,
  //   type: ConversationResponseDTO,
  // })
  async startNewConversation(
    @Body() startConversationDto: StartConversationDTO,
    @ApiKeyEntity() apiKey: ApiKey,
    @Res({ passthrough: false }) res: Response,
  ) {
    try {
      console.log('in start conversation');
      const { message, stream, ...createChatDto } = startConversationDto;
      const chat = await this.chatService.create(apiKey.id, createChatDto);

      await this.messageService.create(chat.id, {
        content: message,
        role: MessageRoles.USER,
      });
      let openaiThreadId = null;
      if (chat.assistantName === 'indian-elephant') {
        // create thread for an openai assistant. Maybe we should do this inside the assistant manager service?
        // cannot put this inside `generateResponse` since it is used for the continue conversation endpoint as well
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        openaiThreadId = (await openai.beta.threads.create()).id;
      }

      // Generate response using the associated assistant
      const responseStream =
        (await this.assistantManagerService.generateResponse(
          chat.assistantName,
          message,
          chat.id, // Pass chat.id as chatId
          openaiThreadId,
        )) as IterableReadableStreamInterface<string>;

      if (!responseStream) {
        throw new InternalServerErrorException(
          'Failed to generate AI response.',
        );
      }

      stream && res.setHeader('Content-Type', 'text/event-stream');
      stream && res.setHeader('Cache-Control', 'no-cache');
      stream && res.setHeader('Connection', 'keep-alive');
      stream && res.setHeader('chatId', chat.id);

      let response = '';
      for await (const chunk of responseStream) {
        response += chunk;

        const completionChunk = {
          delta: {
            content: chunk,
          },
        };

        stream && res.write(`data: ${JSON.stringify(completionChunk)}\n\n`);
      }

      stream && res.write('[DONE]');

      // Save the AI's response as a new message linked to the same chat
      await this.messageService.create(chat.id, {
        content: response,
        role: MessageRoles.ASSISTANT,
      });

      !stream && res.setHeader('Content-Type', 'application/json');
      !stream &&
        res.write(
          JSON.stringify({
            status: 201,
            message:
              'Chat created successfully, message stored and AI response sent back',
            data: {
              chatId: chat.id,
              metadata: chat.metadata,
              response,
              openaiThreadId,
            },
          }),
        );

      res.end();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to start a conversation.',
        `${error.detail} : ${error.message}`,
      );
    }
  }

  @Post(':chatId/continue')
  @Roles(ApiKeyRoles.ADMIN, ApiKeyRoles.CLIENT)
  @ApiOperation({
    summary:
      'Continue an existing conversation by adding a user message and getting the AI response',
  })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @ApiBody({ type: ContinueConversationDTO })
  // TODO: Add proper swagger documentation here (given the output changes based on stream flag)
  // @ApiOkResponseWithWrapper({
  //   description: 'Message stored and AI response sent back',
  //   status: 201,
  //   type: ConversationResponseDTO,
  // })
  async continueConversation(
    @ApiKeyEntity() apiKey: ApiKey,
    @Param('chatId') chatId: string,
    @Body() continueConversationDto: ContinueConversationDTO,
    @Res({ passthrough: false }) res: Response,
  ) {
    const apiKeyId = apiKey.role === ApiKeyRoles.CLIENT ? apiKey.id : undefined;
    // Try to get the chat from cache
    const chatCacheKey = `chat_${chatId}`;
    let chat = await this.cacheManager.get<Chat>(chatCacheKey);

    console.log('in continue conversation');

    if (!chat) {
      chat = await this.chatService.findOne(chatId, apiKeyId);

      if (!chat) {
        throw new NotFoundException(
          `Chat with ID ${chatId} not found for API Key ${apiKeyId}`,
        );
      }

      // Store the fetched chat in cache with an expiration time (60 minutes)
      await this.cacheManager.set(chatCacheKey, chat, 3600);
    } else if (apiKeyId) {
      if (chat.apiKeyId !== apiKeyId) {
        throw new NotFoundException(
          `Chat with ID ${chatId} not found for API Key ${apiKeyId}`,
        );
      }
    }

    const { message, stream, openaiThreadId } = continueConversationDto;

    try {
      await this.messageService.create(chatId, {
        content: message,
        role: MessageRoles.USER,
      });

      // Generate response using the associated assistant
      const responseStream =
        (await this.assistantManagerService.generateResponse(
          chat.assistantName,
          message,
          chatId,
          openaiThreadId,
        )) as IterableReadableStreamInterface<string>;

      if (!responseStream) {
        throw new InternalServerErrorException(
          'Failed to generate AI response.',
        );
      }

      stream && res.setHeader('Content-Type', 'text/event-stream');
      stream && res.setHeader('Cache-Control', 'no-cache');
      stream && res.setHeader('Connection', 'keep-alive');
      stream && res.setHeader('chatId', chatId);

      let response = '';
      for await (const chunk of responseStream) {
        response += chunk;

        const completionChunk = {
          delta: {
            content: chunk,
          },
        };

        stream && res.write(`data: ${JSON.stringify(completionChunk)}\n\n`);
      }

      stream && res.write('[DONE]');

      // Save the AI's response as a new message linked to the same chat
      await this.messageService.create(chatId, {
        content: response,
        role: MessageRoles.ASSISTANT,
      });

      !stream && res.setHeader('Content-Type', 'application/json');
      !stream &&
        res.write(
          JSON.stringify({
            status: 201,
            message: 'Message stored and AI response sent back',
            data: {
              chatId,
              metadata: chat.metadata,
              response,
            },
          }),
        );

      res.end();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to continue a conversation.',
        error.message,
      );
    }
  }

  @Patch(':chatId/title')
  @Roles(ApiKeyRoles.ADMIN, ApiKeyRoles.CLIENT)
  @ApiOperation({ summary: 'Update the title of a specific conversation' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @ApiBody({ type: UpdateChatDTO, description: 'Updated details for the chat' })
  @ApiOkResponseWithWrapper({
    description: 'Conversation (chat) title updated successfully',
    status: 200,
    type: ChatResponseDTO,
  })
  async updateConversationTitle(
    @ApiKeyEntity() apiKey: ApiKey,
    @Param('chatId') chatId: string,
    @Body() updateChatDto: UpdateChatDTO,
  ): Promise<ChatResponseDTO> {
    const apiKeyId = apiKey.role === ApiKeyRoles.CLIENT ? apiKey.id : undefined;
    const updatedChat = await this.chatService.update(
      chatId,
      updateChatDto,
      apiKeyId,
    );

    if (!updatedChat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    return updatedChat;
  }
}
