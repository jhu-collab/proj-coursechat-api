import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class ChatIdGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private chatService: ChatService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const chatId: number = Number(request.params.chatId);

    // If chatId is not provided or not a valid number
    if (isNaN(chatId)) {
      throw new BadRequestException('Invalid or missing chatId');
    }

    await this.chatService.findOne(chatId); // throw NotFoundException if chat doesn't exist
    return true; // Only return true if the chat exists
  }
}
