import { Injectable } from '@nestjs/common';
import {
  BaseAssistantService,
  IterableReadableStreamInterface,
} from './assistant-00-base.service';

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
  ): Promise<IterableReadableStreamInterface<string>> {
    this.logger.verbose(
      `Generating response for input: ${input}, chatId: ${chatId}`,
    );

    let response = `Response from ${this.modelName}: ${input}`;
    if (chatId !== undefined) {
      response += ` for chatId ${chatId}`;
    }

    this.logger.verbose(`Generated response: ${response}`);

    const chunks = response.split(' '); // Splitting by spaces to get words

    const readableStream = new ReadableStream<string>({
      async start(controller) {
        for (const chunk of chunks) {
          await new Promise((resolve) => setTimeout(resolve, 200)); // 200 ms delay
          controller.enqueue(chunk + ' '); // Enqueue each word with a space
        }
        controller.close();
      },
    });

    // Make the ReadableStream also an AsyncIterable
    const iterableStream: IterableReadableStreamInterface<string> = {
      ...readableStream,
      [Symbol.asyncIterator]() {
        const reader = readableStream.getReader();
        return {
          async next() {
            const { value, done } = await reader.read();
            return { value, done };
          },
        };
      },
    };

    return iterableStream;
  }
}
