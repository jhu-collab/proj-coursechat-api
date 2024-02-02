import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './assistant-00-base.service';

/**
 * Service for the "IndianElephant" AI assistant.
 *
 * The IndianElephant is a specialized AI assistant service that simply repeats
 * what the user says. It extends the BaseAssistantService and provides
 * specific implementation details for the "parrot" model.
 *
 * @Injectable - Marks the class as a provider that can be injected into other classes.
 */
@Injectable()
export class IndianElephant extends BaseAssistantService {
  modelName = 'indian-elephant';
  description =
    'Responds while remembering the entire history of a conversation.';

  /**
   * Generates a response based on the given input and optional chat ID.
   *
   * @param {string} input - The input string to generate a response for.
   * @param {string} [chatId] - Optional chat ID to associate with the response.
   * @returns {Promise<IterableReadableStreamInterface<string>>} - A promise resolving to the generated response stream.
   */
  public async generateResponse(
    input: string,
    chatId?: string,
  ): Promise<string> {
    this.logger.verbose(
      `Generating response for input: ${input} in chat: ${chatId || 'N/A'}`,
    );
    return input;
  }
}
