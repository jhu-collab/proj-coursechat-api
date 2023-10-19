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
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { AppRoles } from 'src/api-key/api-key.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { ChatIdGuard } from 'src/guards/chat-id.guard';

@Controller('chats/:chatId/messages')
@UseGuards(ApiKeyGuard, RolesGuard, ChatIdGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @Roles(AppRoles.ADMIN)
  async findAll(
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ): Promise<Message[]> {
    return await this.messageService.findAll(chatId, search, limit, offset);
  }

  @Get(':messageId')
  @Roles(AppRoles.ADMIN)
  async findOne(
    @Param('messageId', new ParseIntPipe()) messageId: number,
  ): Promise<Message> {
    return this.messageService.findOne(Number(messageId));
  }

  @Post()
  @Roles(AppRoles.ADMIN)
  async create(
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Body() createMessageDto: CreateMessageDTO,
  ): Promise<Message> {
    return this.messageService.create(chatId, createMessageDto);
  }

  @Put(':messageId')
  @Roles(AppRoles.ADMIN)
  async update(
    @Param('messageId', new ParseIntPipe()) messageId: number,
    @Body() updateMessageDto: UpdateMessageDTO,
  ): Promise<Message> {
    return this.messageService.update(messageId, updateMessageDto);
  }

  @Delete(':messageId')
  @Roles(AppRoles.ADMIN)
  async delete(
    @Param('messageId', new ParseIntPipe()) messageId: number,
  ): Promise<void> {
    return this.messageService.delete(messageId);
  }
}
