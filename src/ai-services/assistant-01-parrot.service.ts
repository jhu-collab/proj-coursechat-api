import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './assistant-00-base.service';

/**
 * Service for the "Parrot" AI assistant.
 *
 * The ParrotService is a specialized AI assistant service that simply repeats
 * what the user says. It extends the BaseAssistantService and provides
 * specific implementation details for the "parrot" model.
 *
 * @Injectable - Marks the class as a provider that can be injected into other classes.
 */
@Injectable()
export class ParrotService extends BaseAssistantService {
  /**
   * The name of the AI assistant model.
   * This name is used to identify the assistant and is typically used in database records.
   */
  modelName = 'parrot';

  /**
   * A brief description of what this AI assistant does.
   * This description helps to understand the assistant's functionality at a glance.
   */
  description = 'Repeat what you say!';
}
