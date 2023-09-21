import { Injectable, NotFoundException } from '@nestjs/common';
import { Chat } from './chat.interface';
import { CreateChatDTO } from './create-chat.dto';
import { UpdateChatDTO } from './update-chat.dto';
import { UpdateChatPartialDTO } from './update-chat-partial.dto';

@Injectable()
export class ChatService {
  private readonly chats = [
    { id: 1, title: 'Intro to NestJS' },
    { id: 2, title: 'Advanced TypeScript' },
    { id: 3, title: 'Database Integration' },
  ];

  findAll(search?: string, limit?: number, offset?: number): Chat[] {
    let results = this.chats;

    if (search) {
      results = results.filter((chat) => chat.title.includes(search));
    }

    if (offset !== undefined && limit !== undefined) {
      results = results.slice(offset, offset + limit);
    } else if (offset !== undefined) {
      results = results.slice(offset);
    } else if (limit !== undefined) {
      results = results.slice(0, limit);
    }

    return results;
  }

  findOne(id: number): Chat {
    return this.chats.find((chat) => chat.id === id);
  }

  create(createChatDto: CreateChatDTO): Chat {
    const newChat = {
      id: this.chats.length + 1, // simple way to generate the next ID
      ...createChatDto,
    };
    this.chats.push(newChat);
    return newChat;
  }

  update(id: number, updateChatDto: UpdateChatDTO): Chat {
    console.log(typeof id);
    const chatIndex = this.chats.findIndex((chat) => chat.id === id);
    if (chatIndex === -1) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    this.chats[chatIndex] = {
      ...this.chats[chatIndex],
      ...updateChatDto,
    };
    return this.chats[chatIndex];
  }

  updatePartial(id: number, updateChatPartialDto: UpdateChatPartialDTO): Chat {
    const chatIndex = this.chats.findIndex((chat) => chat.id === id);
    if (chatIndex === -1) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    this.chats[chatIndex] = {
      ...this.chats[chatIndex],
      ...updateChatPartialDto,
    };
    return this.chats[chatIndex];
  }

  delete(id: number): void {
    const chatIndex = this.chats.findIndex((chat) => chat.id === id);
    if (chatIndex === -1) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    this.chats.splice(chatIndex, 1);
  }
}
