import { Injectable, NotFoundException } from '@nestjs/common';
import { Chat } from './chat.entity';
import { CreateChatDTO } from './dto/create-chat.dto';
import { UpdateChatDTO } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {}

  async findAll(
    search?: string,
    limit?: number,
    offset?: number,
    apiKeyId?: number,
  ): Promise<Chat[]> {
    const queryBuilder = this.chatRepository.createQueryBuilder('chat');
    let hasWhereCondition = false;

    if (search !== undefined) {
      queryBuilder.where('chat.title ILIKE :search', { search: `%${search}%` });
      hasWhereCondition = true;
    }

    if (apiKeyId !== undefined) {
      if (hasWhereCondition) {
        queryBuilder.andWhere('chat.apiKeyId = :apiKeyId', { apiKeyId });
      } else {
        queryBuilder.where('chat.apiKeyId = :apiKeyId', { apiKeyId });
        hasWhereCondition = true;
      }
    }

    if (limit !== undefined) {
      queryBuilder.limit(limit);
    }

    if (offset !== undefined) {
      queryBuilder.offset(offset);
    }

    return await queryBuilder.getMany();
  }

  async findOne(chatId: number, apiKeyId?: number): Promise<Chat> {
    const filter = { id: chatId };
    if (apiKeyId !== undefined) {
      filter['apiKeyId'] = apiKeyId;
    }
    const chat = await this.chatRepository.findOne({ where: filter });
    if (!chat) {
      let message = `Chat with ID ${chatId} not found`;
      if (apiKeyId !== undefined) {
        message += ` for the given API Key.`;
      }
      throw new NotFoundException(message);
    }
    return chat;
  }

  async findOneOrReturnNull(chatId: number): Promise<Chat | null> {
    return await this.chatRepository.findOneBy({ id: chatId });
  }

  // pre: apiKeyId is valid
  async create(apiKeyId: number, createChatDto: CreateChatDTO): Promise<Chat> {
    const chat = this.chatRepository.create({ ...createChatDto, apiKeyId });
    return await this.chatRepository.save(chat);
  }

  async update(
    chatId: number,
    updateChatDto: UpdateChatDTO,
    apiKeyId?: number,
  ): Promise<Chat> {
    const chat = await this.findOne(chatId, apiKeyId); // This will throw NotFoundException if not found
    for (const key of Object.keys(updateChatDto)) {
      if (updateChatDto[key] !== undefined) {
        chat[key] = updateChatDto[key];
      }
    }
    return await this.chatRepository.save(chat);
  }

  async delete(chatId: number, apiKeyId?: number): Promise<void> {
    const chat = await this.findOne(chatId, apiKeyId); // This will throw NotFoundException if not found
    await this.chatRepository.remove(chat);
  }
}
