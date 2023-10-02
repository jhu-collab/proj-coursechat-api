import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { UpdateMessagePartialDTO } from './dto/update-message-partial.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { CreateMessageDTO } from './dto/create-message.dto';
import { AssistantManagerService } from 'src/ai-services/assistant-manager.service';
import { ChatService } from 'src/chat/chat.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private assistantManagerService: AssistantManagerService,
    private chatService: ChatService,
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
    await this.messageRepository.save(message);

    // Check if assistantName is in the cache
    let assistantName = await this.cacheManager.get<string>(
      `chat-${chatId}-assistantName`,
    );

    // If not in the cache, fetch from the database and store in the cache
    if (!assistantName) {
      const chat = await this.chatService.findOne(chatId);
      assistantName = chat.assistantName;
      await this.cacheManager.set(
        `chat-${chatId}-assistantName`,
        assistantName,
        3600, // cache for 1 hour, adjust as needed
      );
    }

    // Generate response using the associated assistant
    const responseContent = await this.assistantManagerService.generateResponse(
      assistantName,
      message.content,
    );

    // Save the AI's response as a new message linked to the same chat
    const aiMessage = this.messageRepository.create({
      role: 'assistant',
      content: responseContent,
      chatId,
    });
    await this.messageRepository.save(aiMessage);

    return aiMessage;
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
