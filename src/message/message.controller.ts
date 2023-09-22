import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './update-message.dto';
import { UpdateMessagePartialDTO } from './dto/update-message-partial.dto';

@Controller('chats/:chatId/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async findAll(
    @Param('chatId') chatId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<Message[]> {
    const parsedLimit = limit ? Number(limit) : undefined;
    const parsedOffset = offset ? Number(offset) : undefined;
    return await this.messageService.findAll(
      Number(chatId),
      parsedLimit,
      parsedOffset,
    );
  }

  @Get(':messageId')
  async findOne(@Param('messageId') messageId: string): Promise<Message> {
    return this.messageService.findOne(Number(messageId));
  }

  @Post()
  async create(
    @Param('chatId') chatId: string,
    @Body() createMessageDto: CreateMessageDTO,
  ): Promise<Message> {
    return this.messageService.create(Number(chatId), createMessageDto);
  }

  @Put(':messageId')
  async update(
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDTO,
  ): Promise<Message> {
    return this.messageService.update(Number(messageId), updateMessageDto);
  }

  @Patch(':messageId')
  async updatePartial(
    @Param('messageId') messageId: string,
    @Body() updateMessagePartialDto: UpdateMessagePartialDTO,
  ): Promise<Message> {
    return await this.messageService.updatePartial(
      Number(messageId),
      updateMessagePartialDto,
    );
  }

  @Delete(':messageId')
  async delete(@Param('messageId') messageId: string): Promise<void> {
    return this.messageService.delete(Number(messageId));
  }
}
