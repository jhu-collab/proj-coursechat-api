import { Injectable, Logger } from '@nestjs/common';
import { ParrotService } from './assistant-01-parrot.service';
import { DoryService } from './assistant-02-dory.service';
import { BloomService } from './bloom.service';
import {
  BaseAssistantService,
  IterableReadableStreamInterface,
} from './assistant-00-base.service';
import { AssistantService } from 'src/assistant/assistant.service';
import { ElephantService } from './assistant-03-elephant.service';
import { MementoService } from './assistant-04-memento.service';
import { FinchService } from './assistant-05-finch.service';
import { IndianElephant } from './assistant-06-indian-elephant.service';

/**
 * Service managing different AI assistants.
 *
 * This service is responsible for coordinating various AI assistant services
 * like Parrot, Dory, GPT-4, etc. It provides an interface to generate responses
 * and synchronize assistant instances with the database.
 *
 * @Injectable - Marks the class as a provider that can be injected into other classes.
 */
@Injectable()
export class AssistantManagerService {
  private readonly logger = new Logger(AssistantManagerService.name);
  private assistants: Map<string, BaseAssistantService> = new Map();

  /**
   * Constructs the AssistantManagerService with necessary dependencies.
   *
   * @param {AssistantService} assistantService - The service to interact with the assistant database.
   * @param {ParrotService} parrotService - The parrot AI service.
   * @param {DoryService} doryService - The dory AI service.
   * @param {Gpt4Service} gpt4Service - The GPT-4 AI service.
   * @param {BloomService} bloomService - The bloom AI service.
   * @param {ElephantService} elephantService - The elephant AI service.
   * @param {MementoService} mementoService - The memento AI service.
   * @param {FinchService} finchService - The finch AI service.
   */
  constructor(
    private readonly assistantService: AssistantService,
    private parrotService: ParrotService,
    private doryService: DoryService,
    private bloomService: BloomService,
    private elephantService: ElephantService,
    private mementoService: MementoService,
    private finchService: FinchService,
    private indianElephantService: IndianElephant,
  ) {}

  /**
   * Lifecycle hook, called once the host module has been initialized.
   * Initializes the assistant services and synchronizes them with the database.
   */
  async onModuleInit() {
    this.logger.log('Initializing AssistantManagerService...');
    this.assistants.set('parrot', this.parrotService);
    this.assistants.set('dory', this.doryService);
    this.assistants.set('bloom', this.bloomService);
    this.assistants.set('elephant', this.elephantService);
    this.assistants.set('memento', this.mementoService);
    this.assistants.set('finch', this.finchService);
    this.assistants.set('indian-elephant', this.indianElephantService);

    await this.synchronizeWithServices();
    this.logger.log('Synchronized AI services with the database.');
  }

  /**
   * Generates a response from the specified assistant.
   *
   * @param {string} assistantName - The name of the assistant to use.
   * @param {string} input - The input string to generate a response for.
   * @param {string} [chatId] - Optional chat ID associated with the response.
   * @returns {Promise<string | IterableReadableStreamInterface<string>>>} - A promise resolving to the assistant's response.
   */
  public async generateResponse(
    assistantName: string,
    input: string,
    chatId?: string,
    openaiThreadId?: string,
  ): Promise<string | IterableReadableStreamInterface<string>> {
    this.logger.verbose(
      `Generating response with ${assistantName} for input: ${input}`,
    );
    const service = this.assistants.get(assistantName);
    if (!service) {
      throw new Error(`Unknown assistant: ${assistantName}`);
    }
    return service.generateResponse(input, chatId, openaiThreadId);
  }

  /**
   * Synchronizes the available assistant services with the database.
   */
  async synchronizeWithServices(): Promise<void> {
    for (const assistant of this.assistants.values()) {
      const existingAssistant = await this.assistantService.findOne(
        assistant.modelName,
      );
      if (!existingAssistant) {
        await this.assistantService.create({
          name: assistant.modelName,
          description: assistant.description,
        });
        this.logger.verbose(`Created assistant: ${assistant.modelName}`);
      }
    }
  }
}
