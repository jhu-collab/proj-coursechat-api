import { Injectable, NotFoundException } from '@nestjs/common';
import { Chat } from './chat.entity';
import { CreateChatDTO } from './create-chat.dto';
import { UpdateChatDTO } from './update-chat.dto';
import { UpdateChatPartialDTO } from './update-chat-partial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {}

  async findAll(
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<Chat[]> {
    const queryBuilder = this.chatRepository.createQueryBuilder('chat');

    if (search) {
      queryBuilder.where('chat.title LIKE :search', { search: `%${search}%` });
    }

    if (limit !== undefined) {
      queryBuilder.limit(limit);
    }

    if (offset !== undefined) {
      queryBuilder.offset(offset);
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Chat> {
    const chat = await this.chatRepository.findOneBy({ id: id });
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return chat;
  }

  async create(createChatDto: CreateChatDTO): Promise<Chat> {
    const chat = this.chatRepository.create(createChatDto);
    return await this.chatRepository.save(chat);
  }

  async update(id: number, updateChatDto: UpdateChatDTO): Promise<Chat> {
    const chat = await this.findOne(id);
    Object.assign(chat, updateChatDto);
    return await this.chatRepository.save(chat);
  }

  async updatePartial(
    id: number,
    updateChatPartialDto: UpdateChatPartialDTO,
  ): Promise<Chat> {
    await this.update(id, updateChatPartialDto as UpdateChatDTO);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.chatRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
  }
}
