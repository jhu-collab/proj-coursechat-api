import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './base-assistant.service';

@Injectable()
export class Gpt4Service extends BaseAssistantService {
  protected modelName = 'gpt-4';

  // Override other shared methods and properties as needed, or use the ones from BaseAssistantService.
}
