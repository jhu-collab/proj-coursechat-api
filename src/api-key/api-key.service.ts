import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ApiKey, AppRoles } from './api-key.entity';
import { CreateApiKeyDTO } from './api-key-create.dto';
import { UpdateApiKeyDTO } from './api-key-update.dto';
import { FindApiKeysQueryDTO } from './api-key-find-query.dto';

/**
 * Service handling operations related to API keys.
 */
@Injectable()
export class ApiKeyService {

  /**
   * Constructor.
   *
   * @constructor
   * @param {Repository<ApiKey>} apiKeyRepository - Injected API key repository.
   */
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
  ) {}

  /**
   * Finds all API keys based on given query parameters.
   * Supports pagination, search by description, and filtering by isActive status.
   *
   * @param {FindApiKeysQueryDTO} query - Query parameters for searching API keys.
   * @returns {Promise<ApiKey[]>} - Array of API key entities.
   */
  async findAll(query: FindApiKeysQueryDTO): Promise<ApiKey[]> {
    const { limit, offset, search, withDeleted, isActive } = query;
    const description = search ? ILike(`%${search}%`) : undefined;

    const keys = await this.apiKeyRepository.find({
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

    return keys;
  }

  /**
   * Finds a single API key by its ID.
   *
   * @param {string} id - The UUID of the API key.
   * @returns {Promise<ApiKey | null>} - The found API key entity or null.
   */
  async findOne(id: string): Promise<ApiKey | null> {
    return this.apiKeyRepository.findOne({
      where: {
        id: id,
      },
      withDeleted: false,
    });
  }

  /**
   * Finds an API key by its associated role.
   *
   * @param {AppRoles} role - The role associated with the API key.
   * @returns {Promise<ApiKey | null>} - The found API key entity or null.
   */
  async findByRole(role: AppRoles): Promise<ApiKey | null> {
    return this.apiKeyRepository.findOneBy({ role });
  }

  /**
   * Validates if an API key exists and is active.
   *
   * @param {string} id - The UUID of the API key to validate.
   * @returns {Promise<boolean>} - True if the API key exists and is active, false otherwise.
   */
  async validateApiKey(id: string): Promise<boolean> {
    const foundApiKey = await this.apiKeyRepository.findOne({
      where: {
        id: id,
        isActive: true,
      },
      withDeleted: false,
    });

    return Boolean(foundApiKey);
  }

  /**
   * Creates a new API key.
   *
   * @param {CreateApiKeyDTO} createApiKeyDto - The DTO containing data to create a new API key.
   * @returns {Promise<ApiKey>} - The newly created API key entity.
   */
  async create(createApiKeyDto: CreateApiKeyDTO): Promise<ApiKey> {
    const apiKey = this.apiKeyRepository.create(createApiKeyDto);
    return this.apiKeyRepository.save(apiKey);
  }

  /**
   * Updates an existing API key.
   *
   * @param {string} id - The UUID of the API key to update.
   * @param {UpdateApiKeyDTO} updateApiKeyDto - The DTO containing updated data.
   * @returns {Promise<ApiKey | null>} - The updated API key entity or null if not found.
   */
  async update(
    id: string,
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

  /**
   * Soft deletes an API key.
   *
   * @param {string} id - The UUID of the API key to delete.
   * @returns {Promise<ApiKey | null>} - The soft-deleted API key entity or null if not found.
   */
  async delete(id: string): Promise<ApiKey | null> {
    const foundApiKey = await this.findOne(id);

    if (!foundApiKey) {
      return null;
    }

    return this.apiKeyRepository.softRemove(foundApiKey);
  }
}
