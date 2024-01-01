import { Injectable, Logger } from '@nestjs/common';
import { ParrotService } from './parrot.service';
import { DoryService } from './dory.service';
import { Gpt4Service } from './gpt-4.service';
import { BloomService } from './bloom.service';
import { BaseAssistantService } from './base-assistant.service';
import { AssistantService } from 'src/assistant/assistant.service';
import { ElephantService } from './elephant.service';
import { MementoService } from './memento.service';
import { FinchService } from './finch.service';

const logger = new Logger('AssistantManagerService');

@Injectable()
export class AssistantManagerService {
  private assistants: Map<string, BaseAssistantService> = new Map();

  constructor(
    private readonly assistantService: AssistantService,
    private parrotService: ParrotService,
    private doryService: DoryService,
    private gpt4Service: Gpt4Service,
    private bloomService: BloomService,
    private elephantService: ElephantService,
    private mementoService: MementoService,
    private finchService: FinchService,
  ) {}

  async onModuleInit() {
    logger.log('Initializing AssistantManagerService...');
    this.assistants.set('parrot', this.parrotService);
    this.assistants.set('dory', this.doryService);
    this.assistants.set('gpt-4', this.gpt4Service);
    this.assistants.set('bloom', this.bloomService);
    this.assistants.set('elephant', this.elephantService);
    this.assistants.set('memento', this.mementoService);
    this.assistants.set('finch', this.finchService);

    await this.synchronizeWithServices();
    logger.log('Synchronized AI services with the database.');
  }

  public async generateResponse(
    assistantName: string,
    input: string,
    chatId?: string,
  ): Promise<string> {
    const service = this.assistants.get(assistantName);
    if (!service) {
      throw new Error(`Unknown assistant: ${assistantName}`);
    }
    return service.generateResponse(input, chatId); // Add optional chatId parameter
  }

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
      }
    }
  }
}
