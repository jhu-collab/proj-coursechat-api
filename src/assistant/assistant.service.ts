import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Assistant } from './assistant.entity';
import { CreateAssistantDTO } from './assistant-create.dto';
import { UpdateAssistantDTO } from './assistant-update.dto';

@Injectable()
export class AssistantService {
  constructor(
    @InjectRepository(Assistant)
    private assistantRepository: Repository<Assistant>,
  ) {}

  async findAll(
    limit: number,
    offset: number,
    search?: string,
    withDeleted?: boolean,
    isActive?: boolean,
  ): Promise<Assistant[]> {
    const name = search ? ILike(`%${search}%`) : undefined;
    const description = search ? ILike(`%${search}%`) : undefined;

    const assistants = await this.assistantRepository.find({
      take: limit,
      skip: offset,
      where: [
        { name: name, isActive: isActive },
        { description: description, isActive: isActive },
      ],
      order: {
        createdAt: 'DESC',
      },
      withDeleted,
    });

    return assistants;
  }

  async findOne(name: string): Promise<Assistant | null> {
    return this.assistantRepository.findOne({
      where: {
        name: name,
      },
      withDeleted: false,
    });
  }

  async create(createAssistantDto: CreateAssistantDTO): Promise<Assistant> {
    const assistant = this.assistantRepository.create(createAssistantDto);
    return this.assistantRepository.save(assistant);
  }

  async update(
    name: string,
    updateAssistantDto: UpdateAssistantDTO,
  ): Promise<Assistant | null> {
    const assistant = await this.assistantRepository.preload({
      name,
      ...updateAssistantDto,
    });

    if (!assistant) {
      return null;
    }

    return this.assistantRepository.save(assistant);
  }

  async delete(name: string): Promise<Assistant | null> {
    const assistant = await this.findOne(name);

    if (!assistant) {
      return null;
    }

    return this.assistantRepository.softRemove(assistant);
  }
}
