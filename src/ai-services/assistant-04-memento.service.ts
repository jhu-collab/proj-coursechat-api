import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './assistant-00-base.service';
import { MessageService } from 'src/message/message.service';
import { dynamicImport } from 'src/ai-services/assistant.utils';

/**
 * Service for the "Memento" AI assistant.
 *
 * MementoService is an AI assistant service inspired by the movie Memento.
 * It has the ability to remember a portion of the conversation history for generating responses.
 * Similar to the movie's protagonist with short-term memory loss, Memento can only retain the last few messages.
 *
 * @Injectable - Marks the class as a provider that can be injected into other classes.
 */
@Injectable()
export class MementoService extends BaseAssistantService {
  modelName = 'memento';
  description = `Memento is an AI assistant that has the ability to remember 
conversation history. It can generate responses based on both the conversation 
history and the current input.
Similar to the movie Memento, this agent has short-term memory loss and can only 
remember the last few messages in the conversation history.`;

  numberOfMessagesToRemember = 6;

  /**
   * Constructor for MementoService.
   *
   * Initializes the service and injects ConfigService for configuration management and
   * MessageService for accessing message history.
   *
   * @param {ConfigService} configService - The configuration service for accessing environment variables.
   * @param {MessageService} messageService - The service for accessing messages in the chat history.
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {
    super();
    this.logger.log('MementoService initialized');
  }

  /**
   * Generates a response based on the provided input and partial chat history.
   *
   * This method uses the LangChain OpenAI model and attempts to include recent messages in the chat history.
   * The number of messages remembered is limited to a specified amount (numberOfMessagesToRemember).
   *
   * @param {string} input - The input message to be processed by Memento.
   * @param {string} [chatId] - Optional chat ID to fetch recent chat history for context.
   * @returns {Promise<string>} - The AI-generated response.
   */
  public async generateResponse(
    input: string,
    chatId?: string,
  ): Promise<string> {
    this.logger.verbose(
      `Generating response for input: ${input} in chat: ${chatId || 'N/A'}`,
    );
    const { OpenAI } = await dynamicImport('langchain/llms/openai');
    const { HumanMessage, AIMessage } = await dynamicImport('langchain/schema');
    const { BufferWindowMemory, ChatMessageHistory } =
      await dynamicImport('langchain/memory');
    const { ConversationChain } = await dynamicImport('langchain/chains');

    const pastMessages = [];
    if (chatId) {
      const messages = await this.messageService.findAll({ chatId });
      messages.forEach((m) => {
        if (m.role === 'user') {
          pastMessages.push(new HumanMessage(m.content));
        } else if (m.role === 'assistant') {
          pastMessages.push(new AIMessage(m.content));
        }
      });
      this.logger.verbose(
        `Fetched ${messages.length} past messages for chat: ${chatId}`,
      );
    }

    const model = new OpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
    });

    const memory = new BufferWindowMemory({
      k: this.numberOfMessagesToRemember,
      chatHistory: new ChatMessageHistory(pastMessages),
    });

    const chain = new ConversationChain({ llm: model, memory: memory });
    let result = await chain.call({ input });
    result = result?.response || 'No response from Memento bot.';

    this.logger.verbose(`Memento response: ${result}`);

    return result;
  }
}
