import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assistant } from './assistant.entity';
import { CreateAssistantDTO } from './dto/create-assistant.dto';
import { UpdateAssistantDTO } from './dto/update-assistant.dto';

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
    withDeleted?: boolean,
  ): Promise<Assistant[]> {
    const queryBuilder =
      this.assistantRepository.createQueryBuilder('assistant');

    if (search) {
      queryBuilder.where(
        'assistant.name ILIKE :search OR assistant.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (limit !== undefined) {
      queryBuilder.limit(limit);
    }

    if (offset !== undefined) {
      queryBuilder.offset(offset);
    }

    if (withDeleted) {
      queryBuilder.withDeleted();
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

  async findOneOrReturnNull(name: string): Promise<Assistant | null> {
    return await this.assistantRepository.findOneBy({ name });
  }

  async create(createModelDto: CreateAssistantDTO): Promise<Assistant> {
    const existingAssistant = await this.assistantRepository.findOneBy({
      name: createModelDto.name,
    });
    if (existingAssistant) {
      throw new ConflictException(
        `Assistant with name ${createModelDto.name} already exists`,
      );
    }
    const assistant = this.assistantRepository.create(createModelDto);
    return await this.assistantRepository.save(assistant);
  }

  async update(
    name: string,
    updateAssistantDto: UpdateAssistantDTO,
  ): Promise<Assistant> {
    const assistant = await this.findOne(name); // throws NotFoundException if not found
    for (const key of Object.keys(updateAssistantDto)) {
      if (updateAssistantDto[key] !== undefined) {
        assistant[key] = updateAssistantDto[key];
      }
    }
    return await this.assistantRepository.save(assistant);
  }

  async delete(name: string): Promise<void> {
    const assistant = await this.findOne(name); // throws NotFoundException if not found
    await this.assistantRepository.softRemove(assistant);
  }
}
