import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDTO } from './message-create.dto';
import { UpdateMessageDTO } from './message-update.dto';
import { FindMessagesQueryDTO } from './message-find-query.dto';
import { SortOrder } from 'src/dto/sort-order.enum';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async findAll(query: FindMessagesQueryDTO): Promise<Message[]> {
    const { limit, offset, search, chatId, sortOrder = SortOrder.DESC } = query;
    const content = search ? ILike(`%${search}%`) : undefined;

    const messages = await this.messageRepository.find({
      take: limit,
      skip: offset,
      where: {
        content: content,
        chatId: chatId,
      },
      order: {
        createdAt: sortOrder,
      },
    });

    return messages;
  }

  async findOne(messageId: string): Promise<Message | null> {
    return this.messageRepository.findOne({
      where: {
        id: messageId,
      },
    });
  }

  async create(
    chatId: string,
    createMessageDto: CreateMessageDTO,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      ...createMessageDto,
      chatId,
    });
    return this.messageRepository.save(message);
  }

  async update(
    messageId: string,
    updateMessageDto: UpdateMessageDTO,
  ): Promise<Message | null> {
    const message = await this.messageRepository.preload({
      id: messageId,
      ...updateMessageDto,
    });

    if (!message) {
      return null;
    }

    return this.messageRepository.save(message);
  }

  async delete(messageId: string): Promise<Message | null> {
    const message = await this.findOne(messageId);

    if (!message) {
      return;
    }

    return this.messageRepository.remove(message);
  }
}
