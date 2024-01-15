import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Assistant } from './assistant.entity';
import { CreateAssistantDTO } from './assistant-create.dto';
import { UpdateAssistantDTO } from './assistant-update.dto';
import { FindAssistantsQueryDTO } from './assistant-find-query.dto';
import { SortOrder } from 'src/dto/sort-order.enum';

/**
 * Service handling operations related to assistants.
 */
@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  /**
   * Constructor for AssistantService.
   *
   * @param {Repository<Assistant>} assistantRepository - The repository for Assistant entity.
   */
  constructor(
    @InjectRepository(Assistant)
    private assistantRepository: Repository<Assistant>,
  ) {}

  /**
   * Finds all assistants based on the provided query parameters.
   *
   * @param {FindAssistantsQueryDTO} query - Query parameters for searching and sorting assistants.
   * @returns {Promise<Assistant[]>} - Array of Assistant entities.
   */
  async findAll(query: FindAssistantsQueryDTO): Promise<Assistant[]> {
    this.logger.verbose(
      `Finding all assistants with query: ${JSON.stringify(query)}`,
    );

    const {
      limit,
      offset,
      search,
      withDeleted = false,
      isActive = true,
      sortOrder = SortOrder.DESC,
    } = query;
    const name = search ? ILike(`%${search}%`) : undefined;
    const description = search ? ILike(`%${search}%`) : undefined;

    const assistants = await this.assistantRepository.find({
      take: limit,
      skip: offset,
      where: [
        { name: name, isActive: isActive },
        { description: description, isActive: isActive },
      ],
      order: { createdAt: sortOrder },
      withDeleted,
    });

    this.logger.verbose(`Found ${assistants.length} assistants`);
    return assistants;
  }

  /**
   * Finds a single assistant by name.
   *
   * @param {string} name - The name of the assistant to find.
   * @param {boolean} [withDeleted=false] - A flag to include soft-deleted assistants. Defaults to 'false'.
   * @returns {Promise<Assistant | null>} - The Assistant entity or null if not found.
   */
  async findOne(name: string, withDeleted = false): Promise<Assistant | null> {
    this.logger.verbose(`Finding assistant with name: ${name}`);

    return this.assistantRepository.findOne({
      where: { name: name },
      withDeleted: withDeleted,
    });
  }

  /**
   * Creates a new assistant with the given details.
   *
   * @param {CreateAssistantDTO} createAssistantDto - DTO with data for the new assistant.
   * @returns {Promise<Assistant>} - The newly created Assistant entity.
   */
  async create(createAssistantDto: CreateAssistantDTO): Promise<Assistant> {
    this.logger.verbose(`Creating new assistant`);

    const assistant = this.assistantRepository.create(createAssistantDto);
    return this.assistantRepository.save(assistant);
  }

  /**
   * Updates an existing assistant identified by name.
   *
   * @param {string} name - The name of the assistant to update.
   * @param {UpdateAssistantDTO} updateAssistantDto - DTO with updated data.
   * @returns {Promise<Assistant | null>} - The updated Assistant entity or null if not found.
   */
  async update(
    name: string,
    updateAssistantDto: UpdateAssistantDTO,
  ): Promise<Assistant | null> {
    this.logger.verbose(`Updating assistant with name: ${name}`);

    const assistant = await this.assistantRepository.preload({
      name,
      ...updateAssistantDto,
    });

    if (!assistant) {
      this.logger.warn(`Assistant with name ${name} not found`);
      return null;
    }

    return this.assistantRepository.save(assistant);
  }

  /**
   * Soft deletes an assistant identified by name.
   *
   * @param {string} name - The name of the assistant to delete.
   * @returns {Promise<Assistant | null>} - The soft-deleted Assistant entity or null if not found.
   */
  async delete(name: string): Promise<Assistant | null> {
    this.logger.verbose(`Deleting assistant with name: ${name}`);
    const assistant = await this.findOne(name);

    if (!assistant) {
      this.logger.warn(`Assistant with name ${name} not found`);
      return null;
    }

    Object.assign(assistant, { isActive: false });
    return this.assistantRepository.softRemove(assistant);
  }
}
