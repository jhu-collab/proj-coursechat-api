import { Injectable, Logger } from '@nestjs/common';
import { ParrotService } from './parrot.service';
import { Gpt3_5TurboService } from './gpt-3.5-turbo.service';
import { Gpt4Service } from './gpt-4.service';
import { BaseAssistantService } from './base-assistant.service';
import { AssistantService } from 'src/assistant/assistant.service';

const logger = new Logger('AssistantManagerService');

@Injectable()
export class AssistantManagerService {
  private assistants: Map<string, BaseAssistantService> = new Map();

  constructor(
    private readonly assistantService: AssistantService,
    private parrotService: ParrotService,
    private gpt3_5TurboService: Gpt3_5TurboService,
    private gpt4Service: Gpt4Service,
  ) {}

  async onModuleInit() {
    logger.log('Initializing AssistantManagerService...');
    this.assistants.set('parrot', this.parrotService);
    this.assistants.set('gpt-3.5-turbo', this.gpt3_5TurboService);
    this.assistants.set('gpt-4', this.gpt4Service);

    this.synchronizeWithServices();
    logger.log('Synchronized AI services with the database.');
  }

  public async generateResponse(
    assistantName: string,
    input: string,
  ): Promise<string> {
    const service = this.assistants.get(assistantName);
    if (!service) {
      throw new Error(`Unknown assistant: ${assistantName}`);
    }
    return service.generateResponse(input);
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
