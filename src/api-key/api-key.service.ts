import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './api-key.entity';
import { CreateApiKeyDTO } from './dto/create-api-key.dto';
import { UpdateApiKeyDTO } from './dto/update-api-key.dto';
import { UpdateApiKeyPartialDTO } from './dto/update-api-key-partial.dto';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
  ) {}

  async findAll(
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<ApiKey[]> {
    const queryBuilder = this.apiKeyRepository.createQueryBuilder('api');

    queryBuilder.where('api.isDeleted = :isDeleted', { isDeleted: false });

    if (search) {
      queryBuilder.andWhere('api.description LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (limit !== undefined) {
      queryBuilder.limit(limit);
    }

    if (offset !== undefined) {
      queryBuilder.offset(offset);
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: number): Promise<ApiKey> {
    const apiKey = await this.apiKeyRepository.findOneBy({ id });
    if (!apiKey || apiKey.isDeleted) {
      throw new NotFoundException(`API Key with ID ${id} not found`);
    }
    return apiKey;
  }

  async create(createApiKeyDto: CreateApiKeyDTO): Promise<ApiKey> {
    // Generate a random API key
    const generatedKey = crypto.randomBytes(32).toString('hex');

    // Assign the generated key and other fields from DTO to our entity
    const apiKey = this.apiKeyRepository.create({
      ...createApiKeyDto,
      key: generatedKey,
    });

    return await this.apiKeyRepository.save(apiKey);
  }

  async update(id: number, updateApiKeyDto: UpdateApiKeyDTO): Promise<ApiKey> {
    const apiKey = await this.findOne(id);
    Object.assign(apiKey, updateApiKeyDto);
    return await this.apiKeyRepository.save(apiKey);
  }

  async updatePartial(
    id: number,
    updateApiKeyPartialDto: UpdateApiKeyPartialDTO,
  ): Promise<ApiKey> {
    const apiKey = await this.findOne(id);
    for (const key of Object.keys(updateApiKeyPartialDto)) {
      if (updateApiKeyPartialDto[key] !== undefined) {
        apiKey[key] = updateApiKeyPartialDto[key];
      }
    }
    return await this.apiKeyRepository.save(apiKey);
  }

  async delete(id: number): Promise<void> {
    const apiKey = await this.findOne(id);
    apiKey.isDeleted = true;
    await this.apiKeyRepository.save(apiKey);
  }
}
