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
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { AppRoles } from 'src/api-key/api-key.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { ChatIdGuard } from 'src/guards/chat-id.guard';
import { MessageResponseDTO } from './dto/message-response.dto';
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

@ApiTags('Messages')
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
@Controller('chats/:chatId/messages')
@UseGuards(ApiKeyGuard, RolesGuard, ChatIdGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve a list of messages for a chat' })
  @ApiParam({ name: 'chatId', description: 'ID of the chat' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search filter for messages',
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
    description: 'List of messages',
    status: 200,
    type: MessageResponseDTO,
    isArray: true,
  })
  async findAll(
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ): Promise<MessageResponseDTO[]> {
    return await this.messageService.findAll(chatId, search, limit, offset);
  }

  @Get(':messageId')
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve a specific message by ID' })
  @ApiParam({ name: 'chatId', description: 'ID of the chat' })
  @ApiParam({ name: 'messageId', description: 'ID of the message to retrieve' })
  @ApiOkResponseWithWrapper({
    description: 'Message details',
    status: 200,
    type: MessageResponseDTO,
  })
  async findOne(
    @Param('messageId', new ParseIntPipe()) messageId: number,
  ): Promise<MessageResponseDTO> {
    return this.messageService.findOne(Number(messageId));
  }

  @Post()
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Create a new message for a chat' })
  @ApiParam({ name: 'chatId', description: 'ID of the chat' })
  @ApiBody({ type: CreateMessageDTO, description: 'Message details' })
  @ApiOkResponseWithWrapper({
    description: 'Message created successfully',
    status: 201,
    type: MessageResponseDTO,
  })
  async create(
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Body() createMessageDto: CreateMessageDTO,
  ): Promise<MessageResponseDTO> {
    return this.messageService.create(chatId, createMessageDto);
  }

  @Put(':messageId')
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Update a message by ID' })
  @ApiParam({ name: 'chatId', description: 'ID of the chat' })
  @ApiParam({ name: 'messageId', description: 'ID of the message to update' })
  @ApiBody({
    type: UpdateMessageDTO,
    description: 'Updated details for the message',
  })
  @ApiOkResponseWithWrapper({
    description: 'Message updated successfully',
    status: 200,
    type: MessageResponseDTO,
  })
  async update(
    @Param('messageId', new ParseIntPipe()) messageId: number,
    @Body() updateMessageDto: UpdateMessageDTO,
  ): Promise<MessageResponseDTO> {
    return this.messageService.update(messageId, updateMessageDto);
  }

  @Delete(':messageId')
  @Roles(AppRoles.ADMIN)
  @ApiOperation({ summary: 'Delete a message by ID' })
  @ApiParam({ name: 'chatId', description: 'ID of the chat' })
  @ApiParam({ name: 'messageId', description: 'ID of the message to delete' })
  @ApiOkResponseWithWrapper({
    description: 'Message deleted successfully',
    status: 200,
  })
  async delete(
    @Param('messageId', new ParseIntPipe()) messageId: number,
  ): Promise<void> {
    return this.messageService.delete(messageId);
  }
}
