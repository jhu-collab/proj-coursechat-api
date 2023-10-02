import { Injectable } from '@nestjs/common';
import { ParrotService } from './parrot.service';
import { Gpt3_5TurboService } from './gpt-3.5-turbo.service';
import { Gpt4Service } from './gpt-4.service';

@Injectable()
export class AssistantManagerService {
  constructor(
    private parrotService: ParrotService,
    private gpt3_5TurboService: Gpt3_5TurboService,
    private gpt4Service: Gpt4Service,
  ) {}

  public async generateResponse(
    assistantName: string,
    input: string,
  ): Promise<string> {
    switch (assistantName) {
      case 'Parrot':
        return this.parrotService.generateResponse(input);
      case 'gpt-3.5-turbo':
        return this.gpt3_5TurboService.generateResponse(input);
      case 'gpt-4':
        return this.gpt4Service.generateResponse(input);
      default:
        throw new Error(`Unknown assistant: ${assistantName}`);
    }
  }
}
