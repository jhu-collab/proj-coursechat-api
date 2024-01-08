import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ApiKey } from './api-key.entity';
import { ApiKeyRoles } from './api-key-roles.enum';
import { CreateApiKeyDTO } from './api-key-create.dto';
import { UpdateApiKeyDTO } from './api-key-update.dto';
import { FindApiKeysQueryDTO } from './api-key-find-query.dto';
import { SortOrder } from 'src/dto/sort-order.enum';

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
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  /**
   * Finds all API keys based on the provided query parameters.
   * This method supports pagination, searching by description, filtering by active status (`isActive`),
   * and sorting the results based on the creation date.
   *
   * The sorting order can be specified in the query (ascending or descending).
   * If no sorting order is provided, it defaults to descending order, showing the newest API keys first.
   *
   * @param {FindApiKeysQueryDTO} query - Query parameters for searching and sorting API keys.
   *   Includes options for limit, offset, search term, withDeleted flag, isActive status, and sortOrder.
   * @returns {Promise<ApiKey[]>} - An array of API key entities that match the criteria specified in the query.
   *   The array is sorted by the createdAt date in either ascending or descending order, as specified.
   */
  async findAll(query: FindApiKeysQueryDTO): Promise<ApiKey[]> {
    const {
      limit,
      offset,
      search,
      withDeleted,
      isActive,
      sortOrder = SortOrder.DESC,
    } = query;
    const description = search ? ILike(`%${search}%`) : undefined;

    const keys = await this.apiKeyRepository.find({
      take: limit,
      skip: offset,
      where: {
        description: description,
        isActive: isActive,
      },
      order: {
        createdAt: sortOrder,
      },
      withDeleted,
    });

    return keys;
  }

  /**
   * Finds a single API key by its UUID.
   * Optionally allows including keys that have been soft-deleted.
   * By default, it does not return keys that have been soft-deleted.
   * Returns null if no API key is found.
   *
   * @param {string} id - The UUID of the API key to find.
   * @param {boolean} [withDeleted=false] - A flag to include soft-deleted API keys. Defaults to 'false'.
   * @returns {Promise<ApiKey | null>} - The API key entity if found, or null if not found. Includes soft-deleted keys if 'withDeleted' is true.
   */
  async findOne(id: string, withDeleted = false): Promise<ApiKey | null> {
    return this.apiKeyRepository.findOne({
      where: {
        id: id,
      },
      withDeleted: withDeleted,
    });
  }

  /**
   * Finds all API keys based on the specified role.
   * Allows filtering to include or exclude soft-deleted API keys.
   * By default, it excludes soft-deleted keys.
   * Returns an empty array if no API keys are found.
   *
   * @param {ApiKeyRoles} role - The role to filter API keys by.
   * @param {boolean} [withDeleted=false] - A flag to include soft-deleted API keys. Defaults to 'false'.
   * @returns {Promise<ApiKey[]>} - An array of API key entities matching the role, possibly including soft-deleted ones based on the flag.
   */
  async findByRole(role: ApiKeyRoles, withDeleted = false): Promise<ApiKey[]> {
    const whereCondition = { role: role };

    const findOptions = {
      where: whereCondition,
      withDeleted: withDeleted,
    };

    return this.apiKeyRepository.find(findOptions);
  }

  /**
   * Validates whether an API key exists and is active.
   * Does not consider soft-deleted API keys as valid.
   *
   * @param {string} id - The UUID of the API key to validate.
   * @returns {Promise<boolean>} - True if the API key exists, is active, and not soft-deleted; false otherwise.
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
   * Creates a new API key with the given details.
   * The newly created key is immediately saved to the database.
   *
   * @param {CreateApiKeyDTO} createApiKeyDto - The DTO containing data for the new API key.
   * @returns {Promise<ApiKey>} - The newly created API key entity.
   */
  async create(createApiKeyDto: CreateApiKeyDTO): Promise<ApiKey> {
    const apiKey = this.apiKeyRepository.create(createApiKeyDto);
    return this.apiKeyRepository.save(apiKey);
  }

  /**
   * Updates an existing API key identified by its UUID.
   * If the API key does not exist or is soft-deleted, it returns null.
   * Only fields provided in the DTO are updated; others are left unchanged.
   *
   * @param {string} id - The UUID of the API key to update.
   * @param {UpdateApiKeyDTO} updateApiKeyDto - The DTO containing updated data.
   * @returns {Promise<ApiKey | null>} - The updated API key entity, or null if not found or soft-deleted.
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
   * Soft deletes an API key identified by its UUID.
   * If the API key does not exist, it returns null.
   * Soft deletion means the API key is marked as deleted but not removed from the database.
   *
   * @param {string} id - The UUID of the API key to soft delete.
   * @returns {Promise<ApiKey | null>} - The soft-deleted API key entity, or null if not found.
   */
  async delete(id: string): Promise<ApiKey | null> {
    const foundApiKey = await this.findOne(id);

    if (!foundApiKey) {
      return null;
    }

    return this.apiKeyRepository.softRemove(foundApiKey);
  }
}
