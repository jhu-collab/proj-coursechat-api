import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assistant } from './assistant.entity';
import { CreateAssistantDTO } from './dto/create-assistant.dto';
import { UpdateAssistantDTO } from './dto/update-assistant.dto';
import { UpdateAssistantPartialDTO } from './dto/update-assistant-partial.dto';

@Injectable()
export class AssistantService {
  constructor(
    @InjectRepository(Assistant)
    private assistantRepository: Repository<Assistant>,
  ) {}

  async findAll(
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<Assistant[]> {
    const queryBuilder =
      this.assistantRepository.createQueryBuilder('assistant');

    if (search) {
      queryBuilder.where(
        'assistant.name LIKE :search OR assistant.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (limit !== undefined) {
      queryBuilder.limit(limit);
    }

    if (offset !== undefined) {
      queryBuilder.offset(offset);
    }

    return await queryBuilder.getMany();
  }

  async findOne(name: string): Promise<Assistant> {
    const assistant = await this.assistantRepository.findOneBy({ name });
    if (!assistant) {
      throw new NotFoundException(`Assistant with name ${name} not found`);
    }
    return assistant;
  }

  async create(createModelDto: CreateAssistantDTO): Promise<Assistant> {
    const assistant = this.assistantRepository.create(createModelDto);
    return await this.assistantRepository.save(assistant);
  }

  async update(
    name: string,
    updateAssistantDto: UpdateAssistantDTO,
  ): Promise<Assistant> {
    const assistant = await this.findOne(name);
    Object.assign(assistant, updateAssistantDto);
    return await this.assistantRepository.save(assistant);
  }

  async updatePartial(
    name: string,
    updateAssistantPartialDto: UpdateAssistantPartialDTO,
  ): Promise<Assistant> {
    const assistant = await this.findOne(name);
    for (const key of Object.keys(updateAssistantPartialDto)) {
      if (updateAssistantPartialDto[key] !== undefined) {
        assistant[key] = updateAssistantPartialDto[key];
      }
    }
    return await this.assistantRepository.save(assistant);
  }

  async delete(name: string): Promise<void> {
    const assistant = await this.findOne(name);
    await this.assistantRepository.remove(assistant);
  }
}
