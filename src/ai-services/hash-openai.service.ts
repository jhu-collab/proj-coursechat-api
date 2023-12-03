import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './base-assistant.service';

@Injectable()
export class HashOpenaiService extends BaseAssistantService {
  modelName = 'hash-openai';
  description = `Data Structures assistant which augments user prompts using openai's assistant in 'retrieval' mode. 
  This assistant has all lecture notes fed to it as additional context. Under the hood, openai uses retrieval-augmented 
  generation to generate the response.`;

  // Override other shared methods and properties as needed, or use the ones from BaseAssistantService.
}
