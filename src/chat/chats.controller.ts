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
import { ChatService } from './chats.service';
import { Chat } from './chat.interface';
import { CreateChatDTO } from './create-chat.dto';
import { UpdateChatDTO } from './update-chat.dto';
import { UpdateChatPartialDTO } from './update-chat-partial.dto';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Chat[] {
    const parsedLimit = limit ? Number(limit) : undefined;
    const parsedOffset = offset ? Number(offset) : undefined;
    return this.chatService.findAll(search, parsedLimit, parsedOffset);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Chat {
    return this.chatService.findOne(Number(id));
  }

  @Post()
  create(@Body() createChatDto: CreateChatDTO): Chat {
    return this.chatService.create(createChatDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDTO): Chat {
    return this.chatService.update(Number(id), updateChatDto);
  }

  @Patch(':id')
  updatePartial(
    @Param('id') id: string,
    @Body() updateChatPartialDto: UpdateChatPartialDTO,
  ): Chat {
    return this.chatService.updatePartial(Number(id), updateChatPartialDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    this.chatService.delete(Number(id));
  }
}
