import { Injectable } from '@nestjs/common';
import { BaseAssistantService, IterableReadableStreamInterface } from './assistant-00-base.service';
import OpenAI from 'openai';
import { MessageContentText } from 'openai/resources/beta/threads/messages/messages';

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
    openaiThreadId?: string,
  ): Promise<string | IterableReadableStreamInterface<string>> {
    this.logger.verbose(
      `Generating response for input: ${input} in chat: ${chatId || 'N/A'}`,
    );

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    await openai.beta.threads.messages.create(openaiThreadId, {
      role: 'user',
      content: input,
    });
    const run = await openai.beta.threads.runs.create(openaiThreadId, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID,
      instructions:
        'Please address the user as Jane Doe. The user has a premium account.',
    });

    // Keep polling for the run status every 0.5s until it has 'completed'. Unfortunately, openai doesn't provide a webhook at the moment
    let runStatus = (
      await openai.beta.threads.runs.retrieve(openaiThreadId, run.id)
    ).status;
    while (runStatus !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 500));
      runStatus = (
        await openai.beta.threads.runs.retrieve(openaiThreadId, run.id)
      ).status;
    }
    // Pull out the response from the thread and return it
    const messagesInThread =
      await openai.beta.threads.messages.list(openaiThreadId);

    console.log(messagesInThread);
    const responseTextObject = messagesInThread.data[0]
      .content[0] as MessageContentText;
    return responseTextObject.text.value;
  }
}
