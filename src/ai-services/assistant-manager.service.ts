import { Injectable, Logger } from '@nestjs/common';
import { ParrotService } from './parrot.service';
import { DoryService } from './dory.service';
import { Gpt4Service } from './gpt-4.service';
import { BloomService } from './bloom.service';
import { BaseAssistantService } from './base-assistant.service';
import { AssistantService } from 'src/assistant/assistant.service';

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
  ) {}

  async onModuleInit() {
    logger.log('Initializing AssistantManagerService...');
    this.assistants.set('parrot', this.parrotService);
    this.assistants.set('dory', this.doryService);
    this.assistants.set('gpt-4', this.gpt4Service);
    this.assistants.set('bloom', this.bloomService);

    this.synchronizeWithServices();
    logger.log('Synchronized AI services with the database.');
  }

  public async generateResponse(
    assistantName: string,
    input: string,
    contextMessages: string[], // *New historical context parameter
  ): Promise<string> {
    const service = this.assistants.get(assistantName);
    if (!service) {
      throw new Error(`Unknown assistant: ${assistantName}`);
    }
    // *Pass the contextMessages to the service
    return service.generateResponse(input, contextMessages);
  }

  async synchronizeWithServices(): Promise<void> {
    for (const assistant of this.assistants.values()) {
      const existingAssistant = await this.assistantService.findOneOrReturnNull(
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
