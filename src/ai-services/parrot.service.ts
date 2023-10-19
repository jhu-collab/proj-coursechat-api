import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './base-assistant.service';

@Injectable()
export class ParrotService extends BaseAssistantService {
  modelName = 'parrot';
  description = 'Repeat what you say!';
}
