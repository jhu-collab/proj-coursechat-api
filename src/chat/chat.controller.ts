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
  Logger,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { CreateChatDTO } from './dto/create-chat.dto';
import { UpdateChatDTO } from './dto/update-chat.dto';
import { ApiKeyEntity } from 'src/decorators/api-key.decorator';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiKey, AppRoles } from 'src/api-key/api-key.entity';

const logger = new Logger('ChatController');

@Controller('chats')
@UseGuards(ApiKeyGuard, RolesGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  @Roles(AppRoles.ADMIN)
  async findAll(
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ): Promise<Chat[]> {
    return await this.chatService.findAll(search, limit, offset);
  }

  @Get(':chatId')
  @Roles(AppRoles.ADMIN)
  async findOne(
    @Param('chatId', new ParseIntPipe({ optional: true })) chatId: number,
  ): Promise<Chat> {
    return await this.chatService.findOne(chatId);
  }

  @Post()
  @Roles(AppRoles.ADMIN)
  async create(
    @Body() createChatDto: CreateChatDTO,
    @ApiKeyEntity() apiKey: ApiKey,
  ): Promise<Chat> {
    logger.log(`Creating chat for API Key ${apiKey.id}`);
    return await this.chatService.create(apiKey.id, createChatDto);
  }

  @Put(':chatId')
  @Roles(AppRoles.ADMIN)
  async update(
    @Param('chatId', new ParseIntPipe()) chatId: number,
    @Body() updateChatDto: UpdateChatDTO,
  ): Promise<Chat> {
    return await this.chatService.update(chatId, updateChatDto);
  }

  @Delete(':chatId')
  @Roles(AppRoles.ADMIN)
  async delete(
    @Param('chatId', new ParseIntPipe()) chatId: number,
  ): Promise<void> {
    await this.chatService.delete(chatId);
  }
}
