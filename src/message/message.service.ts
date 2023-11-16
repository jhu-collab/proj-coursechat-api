import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { CreateMessageDTO } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  // pre: chatId is valid
  async findAll(
    chatId: number,
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<Message[]> {
    const queryBuilder = this.messageRepository.createQueryBuilder('message');

    queryBuilder
      .where('message.chatId=:chatId', { chatId })
      .orderBy('message.createdAt', 'ASC');

    if (search) {
      queryBuilder.andWhere('message.content ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (limit !== undefined) {
      queryBuilder.limit(limit);
    }

    if (offset !== undefined) {
      queryBuilder.offset(offset);
    }

    return await queryBuilder.getMany();
  }

  async findOne(messageId: number): Promise<Message> {
    const message = await this.messageRepository.findOneBy({ id: messageId });
    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
    return message;
  }

  // pre: chatId is valid
  async create(
    chatId: number,
    createMessageDto: CreateMessageDTO,
  ): Promise<Message> {
    const message = this.messageRepository.create(createMessageDto);
    message.chatId = chatId;
    return await this.messageRepository.save(message);
  }

  async update(
    messageId: number,
    updateMessageDto: UpdateMessageDTO,
  ): Promise<Message> {
    const message = await this.findOne(messageId); // throws NotFoundException if not found
    for (const key of Object.keys(updateMessageDto)) {
      if (updateMessageDto[key] !== undefined) {
        message[key] = updateMessageDto[key];
      }
    }
    return await this.messageRepository.save(message);
  }

  async delete(messageId: number): Promise<void> {
    const message = await this.findOne(messageId); // throws NotFoundException if not found
    await this.messageRepository.remove(message);
  }

  async getContextForChat(chatId: number): Promise<string[]> {
    // *get all messages for this chatId
    const messages = await this.messageRepository.find({
      where: { chat: { id: chatId } },
      order: { createdAt: 'ASC' }, // *order by creation date
    });

    // *return an array of message content
    return messages.map((message) => message.content);
  }

  async clearChatHistory(chatId: number): Promise<void> {
    // *delete all messages for this chatId
    await this.messageRepository.delete({ chat: { id: chatId } });
  }
}
