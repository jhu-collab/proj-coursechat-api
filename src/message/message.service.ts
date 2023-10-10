import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { UpdateMessagePartialDTO } from './dto/update-message-partial.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { CreateMessageDTO } from './dto/create-message.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(
    chatId: number,
    limit?: number,
    offset?: number,
  ): Promise<Message[]> {
    const queryBuilder = this.messageRepository.createQueryBuilder('message');

    queryBuilder.where('message.chatId=:chatId', { chatId });

    if (limit !== undefined) {
      queryBuilder.limit(limit);
    }

    if (offset !== undefined) {
      queryBuilder.offset(offset);
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messageRepository.findOneBy({ id });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async create(
    chatId: number,
    createMessageDto: CreateMessageDTO,
  ): Promise<Message> {
    const message = this.messageRepository.create(createMessageDto);
    message.chatId = chatId;
    return await this.messageRepository.save(message);
  }

  async update(
    id: number,
    updateMessageDto: UpdateMessageDTO,
  ): Promise<Message> {
    const message = await this.findOne(id);
    Object.assign(message, updateMessageDto);
    return await this.messageRepository.save(message);
  }

  async updatePartial(
    id: number,
    updateMessagePartialDto: UpdateMessagePartialDTO,
  ): Promise<Message> {
    const message = await this.findOne(id);
    for (const key of Object.keys(updateMessagePartialDto)) {
      if (updateMessagePartialDto[key] !== undefined) {
        message[key] = updateMessagePartialDto[key];
      }
    }
    return await this.messageRepository.save(message);
  }

  async delete(id: number): Promise<void> {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
  }
}
