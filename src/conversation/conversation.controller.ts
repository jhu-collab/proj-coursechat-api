import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { StartConversationDTO } from './dto/start-conversation.dto';
import { ContinueConversationDTO } from './dto/continue-conversation.dto';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { ApiKeyEntity } from 'src/decorators/api-key.decorator';
import { Message } from 'src/message/message.entity';
import { Chat } from 'src/chat/chat.entity';
import { ConversationResponseDTO } from './dto/conversation-response.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiKey, AppRoles } from 'src/api-key/api-key.entity';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('conversations')
@UseGuards(ApiKeyGuard, RolesGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  // Fetch all conversations for an API key or all conversations for ADMIN
  @Get()
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  async findAllConversation(
    @ApiKeyEntity() apiKey: ApiKey,
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ): Promise<Chat[]> {
    // set the apiKeyId to undefined for ADMIN to get all conversations
    const apiKeyId = apiKey.role === AppRoles.CLIENT ? apiKey.id : undefined;

    return this.conversationService.getAllConversations(
      search,
      limit,
      offset,
      apiKeyId,
    );
  }

  // Retrieve all messages within a specific conversation
  @Get(':chatId/messages')
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  async findAllMessagesInOneConversation(
    @ApiKeyEntity() apiKey: ApiKey,
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ): Promise<Message[]> {
    // set the apiKeyId to undefined for ADMIN to get all conversations
    const apiKeyId = apiKey.role === AppRoles.CLIENT ? apiKey.id : undefined;
    return this.conversationService.getAllMessagesInConversation(
      chatId,
      search,
      limit,
      offset,
      apiKeyId,
    );
  }

  // Initiate a new conversation and get the initial AI response
  @Post('start')
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  async startNewConversation(
    @Body() startConversationDto: StartConversationDTO,
    @ApiKeyEntity() apiKey: ApiKey,
  ): Promise<ConversationResponseDTO> {
    return this.conversationService.startConversation(
      apiKey.id,
      startConversationDto,
    );
  }

  // Continue an existing conversation by adding a user message and getting the AI response
  @Post(':chatId/continue')
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  async continueConversation(
    @ApiKeyEntity() apiKey: ApiKey,
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Body() continueConversationDto: ContinueConversationDTO,
  ): Promise<ConversationResponseDTO> {
    // set the apiKeyId to undefined for ADMIN to get all conversations
    const apiKeyId = apiKey.role === AppRoles.CLIENT ? apiKey.id : undefined;
    return this.conversationService.continueConversation(
      chatId,
      continueConversationDto,
      apiKeyId,
    );
  }

  // Update the title of a specific conversation
  @Patch(':chatId/title')
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  async updateConversationTitle(
    @ApiKeyEntity() apiKey: ApiKey,
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Body('title') title: string,
  ): Promise<Chat> {
    // set the apiKeyId to undefined for ADMIN to get all conversations
    const apiKeyId = apiKey.role === AppRoles.CLIENT ? apiKey.id : undefined;
    return this.conversationService.updateConversationTitle(
      chatId,
      title,
      apiKeyId,
    );
  }
}
