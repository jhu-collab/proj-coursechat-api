import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { CreateChatDTO } from './dto/create-chat.dto';
import { UpdateChatDTO } from './update-chat.dto';
import { UpdateChatPartialDTO } from './update-chat-partial.dto';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<Chat[]> {
    const parsedLimit = limit ? Number(limit) : undefined;
    const parsedOffset = offset ? Number(offset) : undefined;
    return await this.chatService.findAll(search, parsedLimit, parsedOffset);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Chat> {
    return await this.chatService.findOne(Number(id));
  }

  @Post()
  async create(@Body() createChatDto: CreateChatDTO): Promise<Chat> {
    return await this.chatService.create(createChatDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDTO,
  ): Promise<Chat> {
    return await this.chatService.update(Number(id), updateChatDto);
  }

  @Patch(':id')
  async updatePartial(
    @Param('id') id: string,
    @Body() updateChatPartialDto: UpdateChatPartialDTO,
  ): Promise<Chat> {
    return await this.chatService.updatePartial(
      Number(id),
      updateChatPartialDto,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.chatService.delete(Number(id));
  }
}
