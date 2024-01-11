import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { CreateChatDTO } from './chat-create.dto';
import { UpdateChatDTO } from './chat-update.dto';
import { FindChatsQueryDTO } from './chat-find-query.dto';
import { SortOrder } from 'src/dto/sort-order.enum';

/**
 * Service handling operations related to chat sessions.
 */
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  /**
   * Constructor for ChatService.
   *
   * @param {Repository<Chat>} chatRepository - The repository for Chat entity.
   */
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  /**
   * Finds all chats based on the provided query parameters.
   *
   * @param {FindChatsQueryDTO} query - Query parameters for searching and sorting chats.
   * @returns {Promise<Chat[]>} - Array of Chat entities.
   */
  async findAll(query: FindChatsQueryDTO): Promise<Chat[]> {
    this.logger.verbose(
      `Finding all chats with query: ${JSON.stringify(query)}`,
    );

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
      where: { title, apiKeyId, assistantName, username },
      order: { createdAt: sortOrder },
    });

    this.logger.verbose(`Found ${chats.length} chats`);
    return chats;
  }

  /**
   * Finds a single chat by its ID.
   *
   * @param {string} chatId - The ID of the chat to find.
   * @param {string} [apiKeyId] - Optional API key ID for additional filtering.
   * @returns {Promise<Chat | null>} - The Chat entity or null if not found.
   */
  async findOne(chatId: string, apiKeyId?: string): Promise<Chat | null> {
    this.logger.verbose(`Finding chat with ID: ${chatId}`);

    return this.chatRepository.findOne({
      where: { id: chatId, apiKeyId },
    });
  }

  /**
   * Creates a new chat with the given details.
   *
   * @param {string} apiKeyId - The API key ID associated with the chat.
   * @param {CreateChatDTO} createChatDto - DTO with data for the new chat.
   * @returns {Promise<Chat>} - The newly created Chat entity.
   */
  async create(apiKeyId: string, createChatDto: CreateChatDTO): Promise<Chat> {
    this.logger.verbose(`Creating new chat`);

    const chat = this.chatRepository.create({ ...createChatDto, apiKeyId });
    return this.chatRepository.save(chat);
  }

  /**
   * Updates an existing chat identified by its ID.
   *
   * @param {string} chatId - The ID of the chat to update.
   * @param {UpdateChatDTO} updateChatDto - DTO with updated data.
   * @param {string} [apiKeyId] - Optional API key ID for additional filtering.
   * @returns {Promise<Chat | null>} - The updated Chat entity or null if not found.
   */
  async update(
    chatId: string,
    updateChatDto: UpdateChatDTO,
    apiKeyId?: string,
  ): Promise<Chat | null> {
    this.logger.verbose(`Updating chat with ID: ${chatId}`);

    const chat = await this.chatRepository.preload({
      id: chatId,
      apiKeyId,
      ...updateChatDto,
    });

    if (!chat) {
      this.logger.warn(`Chat with ID ${chatId} not found`);
      return null;
    }

    return this.chatRepository.save(chat);
  }

  /**
   * Deletes a chat identified by its ID.
   *
   * @param {string} chatId - The ID of the chat to delete.
   * @param {string} [apiKeyId] - Optional API key ID for additional filtering.
   * @returns {Promise<Chat | null>} - The deleted Chat entity or null if not found.
   */
  async delete(chatId: string, apiKeyId?: string): Promise<Chat | null> {
    this.logger.verbose(`Deleting chat with ID: ${chatId}`);

    const chat = await this.findOne(chatId, apiKeyId);

    if (!chat) {
      this.logger.warn(`Chat with ID ${chatId} not found`);
      return null;
    }

    return this.chatRepository.remove(chat);
  }
}
