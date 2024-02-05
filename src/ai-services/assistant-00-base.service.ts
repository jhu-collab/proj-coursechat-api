import { Logger } from '@nestjs/common';

export interface IterableReadableStreamInterface<T>
  extends ReadableStream<T>,
    AsyncIterable<T> {}

/**
 * Abstract class serving as a base for assistant services.
 * This class provides a basic structure and common functionalities that can be extended by specific assistant services.
 */
export abstract class BaseAssistantService {
  protected readonly logger = new Logger(this.constructor.name);

  /**
   * The model name of the assistant service.
   */
  abstract readonly modelName: string;

  /**
   * A brief description of the assistant service.
   */
  abstract readonly description: string;

  /**
   * Generates a response based on the given input and optional chat ID.
   *
   * @param {string} input - The input string to generate a response for.
   * @param {string} [chatId] - Optional chat ID to associate with the response.
   * @returns {Promise<string | IterableReadableStreamInterface<string>>} - A promise resolving to the generated response string.
   */
  public async generateResponse(
    input: string,
    chatId?: string,
    openaiThreadId?: string,
  ): Promise<string | IterableReadableStreamInterface<string>> {
    this.logger.verbose(
      `Generating response for input: ${input}, chatId: ${chatId}`,
    );

    let response = `Response from ${this.modelName}: ${input}`;
    if (chatId !== undefined) {
      response += ` for chatId ${chatId}`;
    }

    this.logger.verbose(`Generated response: ${response}`);
    return response;
  }
}
