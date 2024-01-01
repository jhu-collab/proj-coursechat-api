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
import { MessageService } from './message.service';
import { CreateMessageDTO } from './message-create.dto';
import { UpdateMessageDTO } from './message-update.dto';
import { MessageResponseDTO } from './message-response.dto';
import { FindMessagesQueryDTO } from './message-find-query.dto';
import { FindMessagesResponseDTO } from './message-find-response.dto';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ChatIdGuard } from 'src/guards/chat-id.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { AppRoles } from 'src/api-key/api-key.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiOkResponseWithWrapper } from 'src/decorators/api-ok-response-wrapper.decorator';
import { CommonApiResponses } from 'src/decorators/common-api-responses.decorator';
import { DefaultPaginationInterceptor } from 'src/interceptors/default-pagination.interceptor';

@ApiTags('Messages')
@CommonApiResponses()
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
  @ApiQuery({ type: FindMessagesQueryDTO })
  @ApiOkResponseWithWrapper({
    description: 'List of messages',
    status: 200,
    type: FindMessagesResponseDTO,
  })
  @UseInterceptors(DefaultPaginationInterceptor)
  async findAll(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Query() query: FindMessagesQueryDTO,
  ): Promise<FindMessagesResponseDTO> {
    Object.assign(query, { chatId });
    const messages = await this.messageService.findAll(query);

    return {
      ...query,
      data: messages,
    };
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
    @Param('chatId', ParseIntPipe) chatId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ): Promise<MessageResponseDTO> {
    const message = await this.messageService.findOne(messageId);

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    return message;
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
    @Param('chatId') chatId: string,
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
    @Param('chatId') chatId: string,
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() updateMessageDto: UpdateMessageDTO,
  ): Promise<MessageResponseDTO> {
    const updatedMessage = await this.messageService.update(
      messageId,
      updateMessageDto,
    );

    if (!updatedMessage) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    return updatedMessage;
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
    @Param('chatId') chatId: string,
    @Param('messageId', ParseIntPipe) messageId: number,
  ): Promise<{ statusCode: number; message: string }> {
    const message = await this.messageService.delete(messageId);

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    return {
      statusCode: 200,
      message: 'Message deleted successfully',
    };
  }
}
