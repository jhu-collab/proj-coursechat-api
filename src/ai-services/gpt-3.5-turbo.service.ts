import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './base-assistant.service';

@Injectable()
export class Gpt3_5TurboService extends BaseAssistantService {
  modelName = 'gpt-3.5-turbo';
  description = "OpenAI's GPT-3.5 Turbo";

  // Override other shared methods and properties as needed, or use the ones from BaseAssistantService.
}
