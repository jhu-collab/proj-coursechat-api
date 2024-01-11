import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { CreateChatDTO } from './chat-create.dto';
import { UpdateChatDTO } from './chat-update.dto';
import { FindChatsQueryDTO } from './chat-find-query.dto';
import { SortOrder } from 'src/dto/sort-order.enum';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async findAll(query: FindChatsQueryDTO): Promise<Chat[]> {
    const {
      limit,
      offset,
      search,
      apiKeyId,
      assistantName,
      username,
      sortOrder = SortOrder.DESC,
    } = query;
    const title = search ? ILike(`%${search}%`) : undefined;

    const chats = await this.chatRepository.find({
      take: limit,
      skip: offset,
      where: {
        title: title,
        apiKeyId: apiKeyId,
        assistantName: assistantName,
        username: username,
      },
      order: {
        createdAt: sortOrder,
      },
    });

    return chats;
  }

  async findOne(chatId: string, apiKeyId?: string): Promise<Chat | null> {
    return this.chatRepository.findOne({
      where: {
        id: chatId,
        apiKeyId: apiKeyId,
      },
    });
  }

  async create(apiKeyId: string, createChatDto: CreateChatDTO): Promise<Chat> {
    const chat = this.chatRepository.create({ ...createChatDto, apiKeyId });
    return this.chatRepository.save(chat);
  }

  async update(
    chatId: string,
    updateChatDto: UpdateChatDTO,
    apiKeyId?: string,
  ): Promise<Chat | null> {
    const chat = await this.chatRepository.preload({
      id: chatId,
      apiKeyId,
      ...updateChatDto,
    });

    if (!chat) {
      return null;
    }

    return this.chatRepository.save(chat);
  }

  async delete(chatId: string, apiKeyId?: string): Promise<Chat | null> {
    const chat = await this.findOne(chatId, apiKeyId);

    if (!chat) {
      return;
    }

    return this.chatRepository.remove(chat);
  }
}
