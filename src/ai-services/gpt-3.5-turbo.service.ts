import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './base-assistant.service';

@Injectable()
export class Gpt3_5TurboService extends BaseAssistantService {
  protected modelName = 'gpt-3.5-turbo';

  // Override other shared methods and properties as needed, or use the ones from BaseAssistantService.
}
