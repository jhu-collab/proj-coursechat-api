import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './dto/create-chat.dto';
import { UpdateChatDTO } from './dto/update-chat.dto';
import { ApiKeyEntity } from 'src/decorators/api-key.decorator';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiKey, AppRoles } from 'src/api-key/api-key.entity';
import { ChatResponseDTO } from './dto/chat-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { ErrorResponseDTO } from 'src/dto/error-response.dto';
import { ApiOkResponseWithWrapper } from 'src/decorators/api-ok-response-wrapper.decorator';

@ApiTags('Chats')
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
@Controller('chats')
@UseGuards(ApiKeyGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve a list of chats' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search filter for chats',
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
    description: 'List of chats',
    status: 200,
    type: ChatResponseDTO,
    isArray: true,
  })
  async findAll(
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ): Promise<ChatResponseDTO[]> {
    return await this.chatService.findAll(search, limit, offset);
  }

  @Get(':chatId')
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve a specific chat by ID' })
  @ApiParam({ name: 'chatId', description: 'ID of the chat to retrieve' })
  @ApiOkResponseWithWrapper({
    description: 'Chat details',
    status: 200,
    type: ChatResponseDTO,
  })
  async findOne(
    @Param('chatId', new ParseIntPipe({ optional: true })) chatId: number,
  ): Promise<ChatResponseDTO> {
    return await this.chatService.findOne(chatId);
  }

  @Post()
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiBody({ type: CreateChatDTO, description: 'Chat details' })
  @ApiOkResponseWithWrapper({
    description: 'Chat created successfully',
    status: 201,
    type: ChatResponseDTO,
  })
  async create(
    @Body() createChatDto: CreateChatDTO,
    @ApiKeyEntity() apiKey: ApiKey,
  ): Promise<ChatResponseDTO> {
    return await this.chatService.create(apiKey.id, createChatDto);
  }

  @Put(':chatId')
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Update a chat by ID' })
  @ApiParam({ name: 'chatId', description: 'ID of the chat to update' })
  @ApiBody({ type: UpdateChatDTO, description: 'Updated details for the chat' })
  @ApiOkResponseWithWrapper({
    description: 'Chat updated successfully',
    status: 200,
    type: ChatResponseDTO,
  })
  async update(
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Body() updateChatDto: UpdateChatDTO,
  ): Promise<ChatResponseDTO> {
    return await this.chatService.update(chatId, updateChatDto);
  }

  @Delete(':chatId')
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Delete a chat by ID' })
  @ApiParam({ name: 'chatId', description: 'ID of the chat to delete' })
  @ApiOkResponseWithWrapper({
    description: 'Chat deleted successfully',
    status: 200,
  })
  async delete(
    @Param('chatId', new ParseIntPipe()) chatId: number,
  ): Promise<void> {
    await this.chatService.delete(chatId);
  }
}
