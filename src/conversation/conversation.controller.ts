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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { StartConversationDTO } from './dto/start-conversation.dto';
import { ContinueConversationDTO } from './dto/continue-conversation.dto';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { ApiKeyEntity } from 'src/decorators/api-key.decorator';
import { ConversationResponseDTO } from './dto/conversation-response.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiKey, AppRoles } from 'src/api-key/api-key.entity';
import { RolesGuard } from 'src/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { ChatResponseDTO } from 'src/chat/chat-response.dto';
import { MessageResponseDTO } from 'src/message/message-response.dto';
import { ErrorResponseDTO } from 'src/dto/error-response.dto';
import { ApiOkResponseWithWrapper } from 'src/decorators/api-ok-response-wrapper.decorator';

@ApiTags('Conversations')
@ApiResponse({
  status: 400,
  description: 'Bad Request',
  type: ErrorResponseDTO,
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
  type: ErrorResponseDTO,
})
@ApiResponse({ status: 404, description: 'Not Found', type: ErrorResponseDTO })
@ApiResponse({
  status: 500,
  description: 'Internal Server Error',
  type: ErrorResponseDTO,
})
@ApiSecurity('apiKey')
@Controller('conversations')
@UseGuards(ApiKeyGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  @ApiOperation({
    summary:
      'Fetch all conversations for an API key or all conversations for ADMIN',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search query for conversations',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit the number of results',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
  })
  @ApiOkResponseWithWrapper({
    description: 'List of conversations (chats)',
    status: 200,
    type: ChatResponseDTO,
    isArray: true,
  })
  async findAllConversation(
    @ApiKeyEntity() apiKey: ApiKey,
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ): Promise<ChatResponseDTO[]> {
    const apiKeyId = apiKey.role === AppRoles.CLIENT ? apiKey.id : undefined;
    return this.conversationService.getAllConversations(
      search,
      limit,
      offset,
      apiKeyId,
    );
  }

  @Get(':chatId/messages')
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  @ApiOperation({
    summary: 'Retrieve all messages within a specific conversation (chat)',
  })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @ApiOkResponseWithWrapper({
    description: 'List of messages',
    status: 200,
    type: MessageResponseDTO,
    isArray: true,
  })
  async findAllMessagesInOneConversation(
    @ApiKeyEntity() apiKey: ApiKey,
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ): Promise<MessageResponseDTO[]> {
    const apiKeyId = apiKey.role === AppRoles.CLIENT ? apiKey.id : undefined;
    return this.conversationService.getAllMessagesInConversation(
      chatId,
      search,
      limit,
      offset,
      apiKeyId,
    );
  }

  @Post('start')
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  @ApiOperation({
    summary: 'Initiate a new conversation and get the initial AI response',
  })
  @ApiBody({ type: StartConversationDTO })
  @ApiOkResponseWithWrapper({
    description:
      'Chat created successfully, message stored and AI response sent back',
    status: 201,
    type: ConversationResponseDTO,
  })
  async startNewConversation(
    @Body() startConversationDto: StartConversationDTO,
    @ApiKeyEntity() apiKey: ApiKey,
  ): Promise<ConversationResponseDTO> {
    return this.conversationService.startConversation(
      apiKey.id,
      startConversationDto,
    );
  }

  @Post(':chatId/continue')
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  @ApiOperation({
    summary:
      'Continue an existing conversation by adding a user message and getting the AI response',
  })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @ApiBody({ type: ContinueConversationDTO })
  @ApiOkResponseWithWrapper({
    description: 'Message stored and AI response sent back',
    status: 201,
    type: ConversationResponseDTO,
  })
  async continueConversation(
    @ApiKeyEntity() apiKey: ApiKey,
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Body() continueConversationDto: ContinueConversationDTO,
  ): Promise<ConversationResponseDTO> {
    const apiKeyId = apiKey.role === AppRoles.CLIENT ? apiKey.id : undefined;
    return this.conversationService.continueConversation(
      chatId,
      continueConversationDto,
      apiKeyId,
    );
  }

  @Patch(':chatId/title')
  @Roles(AppRoles.ADMIN, AppRoles.CLIENT)
  @ApiOperation({ summary: 'Update the title of a specific conversation' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @ApiOkResponseWithWrapper({
    description: 'Conversation (chat) title updated successfully',
    status: 200,
    type: ChatResponseDTO,
  })
  async updateConversationTitle(
    @ApiKeyEntity() apiKey: ApiKey,
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Body('title') title: string,
  ): Promise<ChatResponseDTO> {
    const apiKeyId = apiKey.role === AppRoles.CLIENT ? apiKey.id : undefined;
    return this.conversationService.updateConversationTitle(
      chatId,
      title,
      apiKeyId,
    );
  }
}
