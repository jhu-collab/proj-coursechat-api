import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './base-assistant.service';

@Injectable()
export class ParrotService extends BaseAssistantService {
  protected modelName = 'Parrot';
}
