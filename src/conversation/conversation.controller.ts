import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { StartConversationDTO } from './dto/start-conversation.dto';
import { ContinueConversationDTO } from './dto/continue-conversation.dto';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { ApiKey } from 'src/decorators/api-key.decorator';
import { Message } from 'src/message/message.entity';
import { Chat } from 'src/chat/chat.entity';
import { ConversationResponseDTO } from './dto/conversation-response.dto';

@Controller('conversations')
@UseGuards(ApiKeyGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<Chat[]> {
    const parsedLimit = limit ? Number(limit) : undefined;
    const parsedOffset = offset ? Number(offset) : undefined;
    return await this.conversationService.getAllConversations(
      parsedLimit,
      parsedOffset,
    );
  }

  @Get(':chatId/messages')
  async findOne(
    @Param('chatId') chatId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<Message[]> {
    const parsedLimit = limit ? Number(limit) : undefined;
    const parsedOffset = offset ? Number(offset) : undefined;
    return this.conversationService.getAllMessagesInConversation(
      Number(chatId),
      parsedLimit,
      parsedOffset,
    );
  }

  @Post('start')
  async create(
    @Body() startConversationDto: Omit<StartConversationDTO, 'apiKeyId'>,
    @ApiKey() apiKey: string,
  ): Promise<ConversationResponseDTO> {
    return this.conversationService.startConversation({
      ...startConversationDto,
      apiKeyId: apiKey,
    });
  }

  @Post(':chatId/continue')
  async update(
    @Param('chatId') chatId: string,
    @Body() continueConversationDto: ContinueConversationDTO,
  ): Promise<ConversationResponseDTO> {
    return this.conversationService.continueConversation(
      Number(chatId),
      continueConversationDto,
    );
  }

  @Patch(':chatId/title')
  async updatePartial(
    @Param('chatId') chatId: string,
    @Body('title') title: string,
  ): Promise<Chat> {
    return await this.conversationService.updateConversationTitle(
      Number(chatId),
      title,
    );
  }

  @Delete(':chatId')
  async delete(@Param('chatId') chatId: string): Promise<void> {
    return this.conversationService.deleteConversation(Number(chatId));
  }
}
