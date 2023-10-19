import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './base-assistant.service';

@Injectable()
export class Gpt4Service extends BaseAssistantService {
  modelName = 'gpt-4';
  description = "OpenAI's GPT-4 ";

  // Override other shared methods and properties as needed, or use the ones from BaseAssistantService.
}
