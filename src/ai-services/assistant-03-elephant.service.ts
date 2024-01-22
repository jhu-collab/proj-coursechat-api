import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './assistant-00-base.service';
import { dynamicImport } from 'src/ai-services/assistant.utils';
import { MessageService } from 'src/message/message.service';

/**
 * Service for the "Elephant" AI assistant.
 *
 * ElephantService is an AI assistant service inspired by the saying "elephants never forget."
 * This assistant attempts to remember the entire history of a conversation. However, due to limitations
 * such as the prompt limit of the OpenAI API, it might not always retain all conversation details.
 *
 * @Injectable - Marks the class as a provider that can be injected into other classes.
 */
@Injectable()
export class ElephantService extends BaseAssistantService {
  modelName = 'elephant';
  description = `It is said that 'elephants never forget.'
Elephant is an AI assistant that tries to remember the entire history of a conversation.
But it is not a sophisticated model as it can max out the prompt limit of OpenAI API 
by trying to remember too much.`;

  /**
   * Constructor for ElephantService.
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
    this.logger.log('ElephantService initialized');
  }

  /**
   * Generates a response based on the provided input and chat history.
   *
   * This method uses the LangChain OpenAI model and attempts to include past messages in the chat history.
   * However, it may exceed the prompt limit for large conversations.
   *
   * @param {string} input - The input message to be processed by Elephant.
   * @param {string} [chatId] - Optional chat ID to fetch the chat history for context.
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
    const { BufferMemory, ChatMessageHistory } =
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

    const memory = new BufferMemory({
      chatHistory: new ChatMessageHistory(pastMessages),
    });

    const chain = new ConversationChain({ llm: model, memory: memory });
    let result = await chain.call({ input });
    result = result?.response || 'No response from Elephant bot.';

    this.logger.verbose(`Elephant response: ${result}`);

    return result;
  }
}
