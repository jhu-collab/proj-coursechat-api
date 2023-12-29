import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ApiKey, AppRoles } from './api-key.entity';
import { CreateApiKeyDTO } from './api-key-create.dto';
import { UpdateApiKeyDTO } from './api-key-update.dto';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
  ) {}

  async findAll(
    limit: number,
    offset: number,
    search?: string,
    withDeleted?: boolean,
    isActive?: boolean,
  ): Promise<ApiKey[]> {
    const description = search ? ILike(`%${search}%`) : undefined;

    const cards = await this.apiKeyRepository.find({
      take: limit,
      skip: offset,
      where: {
        description: description,
        isActive: isActive,
      },
      order: {
        createdAt: 'DESC',
      },
      withDeleted,
    });

    return cards;
  }

  async findOne(id: number): Promise<ApiKey | null> {
    return this.apiKeyRepository.findOne({
      where: {
        id: id,
      },
      withDeleted: false,
    });
  }

  async findByRole(role: AppRoles): Promise<ApiKey | null> {
    return this.apiKeyRepository.findOneBy({ role });
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    return this.apiKeyRepository.findOne({
      where: {
        apiKeyValue: key,
      },
      withDeleted: false,
    });
  }

  async validateApiKey(key: string): Promise<boolean> {
    const foundApiKey = await this.apiKeyRepository.findOne({
      where: {
        apiKeyValue: key,
        isActive: true,
      },
      withDeleted: false,
    });

    return Boolean(foundApiKey); // Returns true if 'foundApiKey' is truthy (e.g., a non-empty string).
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

  async update(
    id: number,
    updateApiKeyDto: UpdateApiKeyDTO,
  ): Promise<ApiKey | null> {
    const apiKey = await this.apiKeyRepository.preload({
      id,
      ...updateApiKeyDto,
    });

    if (!apiKey) {
      return null;
    }

    return this.apiKeyRepository.save(apiKey);
  }

  async delete(id: number): Promise<ApiKey | null> {
    const foundApiKey = await this.findOne(id);

    if (!foundApiKey) {
      return null;
    }

    return this.apiKeyRepository.softRemove(foundApiKey);
  }
}
