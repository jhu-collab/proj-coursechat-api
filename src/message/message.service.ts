import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDTO } from './message-create.dto';
import { UpdateMessageDTO } from './message-update.dto';
import { FindMessagesQueryDTO } from './message-find-query.dto';
import { SortOrder } from 'src/dto/sort-order.enum';

/**
 * Service handling operations related to messages.
 */
@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  /**
   * Constructor for MessageService.
   *
   * @param {Repository<Message>} messageRepository - The repository for Message entity.
   */
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  /**
   * Finds all messages based on the provided query parameters.
   *
   * @param {FindMessagesQueryDTO} query - Query parameters for searching and sorting messages.
   * @returns {Promise<Message[]>} - Array of Message entities.
   */
  async findAll(query: FindMessagesQueryDTO): Promise<Message[]> {
    this.logger.verbose(
      `Finding all messages with query: ${JSON.stringify(query)}`,
    );

    const { limit, offset, search, chatId, sortOrder = SortOrder.ASC } = query;
    const content = search ? ILike(`%${search}%`) : undefined;

    const messages = await this.messageRepository.find({
      take: limit,
      skip: offset,
      where: { content, chatId },
      order: { createdAt: sortOrder },
    });

    this.logger.verbose(`Found ${messages.length} messages`);
    return messages;
  }

  /**
   * Finds a single message by its ID.
   *
   * @param {string} messageId - The ID of the message to find.
   * @returns {Promise<Message | null>} - The Message entity or null if not found.
   */
  async findOne(messageId: string): Promise<Message | null> {
    this.logger.verbose(`Finding message with ID: ${messageId}`);

    return this.messageRepository.findOne({
      where: { id: messageId },
    });
  }

  /**
   * Creates a new message with the given details.
   *
   * @param {string} chatId - The chat ID associated with the message.
   * @param {CreateMessageDTO} createMessageDto - DTO with data for the new message.
   * @returns {Promise<Message>} - The newly created Message entity.
   */
  async create(
    chatId: string,
    createMessageDto: CreateMessageDTO,
  ): Promise<Message> {
    this.logger.verbose(`Creating new message`);

    const message = this.messageRepository.create({
      ...createMessageDto,
      chatId,
    });
    return this.messageRepository.save(message);
  }

  /**
   * Updates an existing message identified by its ID.
   *
   * @param {string} messageId - The ID of the message to update.
   * @param {UpdateMessageDTO} updateMessageDto - DTO with updated data.
   * @returns {Promise<Message | null>} - The updated Message entity or null if not found.
   */
  async update(
    messageId: string,
    updateMessageDto: UpdateMessageDTO,
  ): Promise<Message | null> {
    this.logger.verbose(`Updating message with ID: ${messageId}`);

    const message = await this.messageRepository.preload({
      id: messageId,
      ...updateMessageDto,
    });

    if (!message) {
      this.logger.warn(`Message with ID ${messageId} not found`);
      return null;
    }

    return this.messageRepository.save(message);
  }

  /**
   * Deletes a message identified by its ID.
   *
   * @param {string} messageId - The ID of the message to delete.
   * @returns {Promise<Message | null>} - The deleted Message entity or null if not found.
   */
  async delete(messageId: string): Promise<Message | null> {
    this.logger.verbose(`Deleting message with ID: ${messageId}`);

    const message = await this.findOne(messageId);

    if (!message) {
      this.logger.warn(`Message with ID ${messageId} not found`);
      return null;
    }

    return this.messageRepository.remove(message);
  }
}
