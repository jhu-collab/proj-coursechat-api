import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey, AppRoles } from './api-key.entity';
import { CreateApiKeyDTO } from './dto/create-api-key.dto';
import { UpdateApiKeyDTO } from './dto/update-api-key.dto';
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
    withDeleted?: boolean,
  ): Promise<ApiKey[]> {
    const queryBuilder = this.apiKeyRepository.createQueryBuilder('api');

    if (search) {
      queryBuilder.where('api.description ILIKE :search', {
        search: `%${search}%`,
      });
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

  async findOne(id: number): Promise<ApiKey> {
    const foundApiKey = await this.apiKeyRepository.findOne({
      where: {
        id: id,
      },
      withDeleted: false,
    });
    if (!foundApiKey) {
      throw new NotFoundException(`API Key with ID ${id} not found`);
    }
    return foundApiKey;
  }

  async findByRole(role: AppRoles): Promise<ApiKey | undefined> {
    return await this.apiKeyRepository.findOneBy({ role });
  }

  async findByKey(key: string): Promise<ApiKey | undefined> {
    const foundApiKey = await this.apiKeyRepository.findOne({
      where: {
        apiKeyValue: key,
      },
      withDeleted: false,
    });
    if (!foundApiKey) {
      throw new NotFoundException(`API Key ${key} not found`);
    }
    return foundApiKey;
  }

  async validateApiKey(key: string): Promise<boolean> {
    const foundApiKey = await this.apiKeyRepository.findOne({
      where: {
        apiKeyValue: key,
        isActive: true,
      },
      withDeleted: false,
    });

    return !!foundApiKey;
  }

  async create(createApiKeyDto: CreateApiKeyDTO): Promise<ApiKey> {
    // Generate a random API key
    const generatedKey = crypto.randomBytes(32).toString('hex');

    // Assign the generated key and other fields from DTO to our entity
    const apiKey = this.apiKeyRepository.create({
      ...createApiKeyDto,
      apiKeyValue: generatedKey,
    });

    return await this.apiKeyRepository.save(apiKey);
  }

  async update(id: number, updateApiKeyDto: UpdateApiKeyDTO): Promise<ApiKey> {
    const apiKey = await this.findOne(id); // throws NotFoundException if not found
    for (const key of Object.keys(updateApiKeyDto)) {
      if (updateApiKeyDto[key] !== undefined) {
        apiKey[key] = updateApiKeyDto[key];
      }
    }
    return await this.apiKeyRepository.save(apiKey);
  }

  async delete(id: number): Promise<void> {
    const apiKey = await this.findOne(id); // throws NotFoundException if not found
    await this.apiKeyRepository.softRemove(apiKey);
  }
}
