import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { CreateChatDTO } from './chat-create.dto';
import { UpdateChatDTO } from './chat-update.dto';
import { ApiKeyEntity } from 'src/decorators/api-key.decorator';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ChatResponseDTO } from './chat-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiOkResponseWithWrapper } from 'src/decorators/api-ok-response-wrapper.decorator';
import { FindChatsQueryDTO } from './chat-find-query.dto';
import { FindChatsResponseDTO } from './chat-find-response.dto';
import { ApiKey, AppRoles } from 'src/api-key/api-key.entity';
import { CommonApiResponses } from 'src/decorators/common-api-responses.decorator';

@ApiTags('Chats')
@CommonApiResponses()
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
    type: FindChatsQueryDTO,
  })
  @ApiOkResponseWithWrapper({
    description: 'List of chats along with pagination details and filters',
    status: 200,
    type: FindChatsResponseDTO,
  })
  async findAll(
    @Query() query: FindChatsQueryDTO,
  ): Promise<FindChatsResponseDTO> {
    const chats: Chat[] = await this.chatService.findAll(query);

    return {
      ...query,
      data: chats,
    };
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
    @Param('chatId', ParseIntPipe) chatId: number,
  ): Promise<ChatResponseDTO> {
    const chat = await this.chatService.findOne(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    return chat;
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
    return this.chatService.create(apiKey.id, createChatDto);
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
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() updateChatDto: UpdateChatDTO,
  ): Promise<ChatResponseDTO> {
    const updatedChat = await this.chatService.update(chatId, updateChatDto);
    if (!updatedChat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    return updatedChat;
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
    @Param('chatId', ParseIntPipe) chatId: number,
  ): Promise<{ statusCode: number; message: string }> {
    const chat = await this.chatService.findOne(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }
    await this.chatService.delete(chatId);

    return {
      statusCode: 200,
      message: 'Chat deleted successfully',
    };
  }
}
