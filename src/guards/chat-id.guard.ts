import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isUUID } from 'class-validator';
import { ChatService } from 'src/chat/chat.service';

/**
 * A guard that ensures the validity and existence of a chat ID in the request.
 *
 * This guard is applied to routes that require a valid chat ID as a parameter.
 * It first validates if the chat ID is a valid UUID, then checks if a chat with that ID exists in the database.
 * If the chat ID is invalid or the chat does not exist, it throws an appropriate exception.
 *
 * @implements {CanActivate}
 */
@Injectable()
export class ChatIdGuard implements CanActivate {
  private readonly logger = new Logger(ChatIdGuard.name);

  /**
   * Constructs a new instance of ChatIdGuard.
   *
   * @param {Reflector} reflector - A helper class provided by NestJS to access route metadata.
   * @param {ChatService} chatService - The service to query chat data.
   */
  constructor(
    private reflector: Reflector,
    private chatService: ChatService,
  ) {}

  /**
   * Checks if the chat ID in the request is valid and exists.
   *
   * @param {ExecutionContext} context - The execution context of the request in the NestJS application.
   * @returns {Promise<boolean>} - True if the chat ID is valid and the chat exists; otherwise, throws an exception.
   * @throws {BadRequestException} - Thrown if the chat ID is invalid.
   * @throws {NotFoundException} - Thrown if a chat with the provided ID does not exist.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.verbose('Validating chat ID in the request...');

    const request = context.switchToHttp().getRequest();
    const chatId: string = request.params.chatId;

    // Validate if chatId is a valid UUID
    if (!isUUID(chatId)) {
      this.logger.error(`Invalid chat ID: ${chatId}`);
      throw new BadRequestException('Invalid or missing chatId');
    }

    this.logger.verbose(`Checking existence of chat with ID: ${chatId}`);
    const chat = await this.chatService.findOne(chatId);

    if (!chat) {
      this.logger.warn(`Chat with ID ${chatId} not found`);
      throw new NotFoundException(`Chat with id ${chatId} not found`);
    }

    this.logger.verbose(`Chat with ID ${chatId} is valid and exists`);
    return true; // Chat exists
  }
}
