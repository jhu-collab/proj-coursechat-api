import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './assistant-00-base.service';
import { MessageService } from 'src/message/message.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';

/**
 * Service for the "Finch" AI assistant.
 *
 * FinchService is an AI assistant inspired by Atticus Finch from Harper Lee's "To Kill a Mockingbird."
 * It is designed to summarize conversation history and generate responses based on the summary and current input,
 * excelling in maintaining the context of the conversation.
 *
 * @Injectable - Marks the class as a provider that can be injected into other classes.
 */
@Injectable()
export class FinchService extends BaseAssistantService {
  modelName = 'finch';
  description = `Finch is an AI assistant that has the ability to summarize conversation history 
to generate responses based on both the conversation summary and the current input. 
It is not good at remembering details but it is good at maintaining the context of the conversation.
Named after Atticus Finch (Fictional Character) from Harper Lee's "To Kill a Mockingbird," 
Finch is known for summarizing moral and ethical dilemmas in a way that is both profound and accessible.`;

  /**
   * Constructor for FinchService.
   *
   * Initializes the service and injects ConfigService for configuration management and
   * MessageService for accessing message history.
   *
   * @param {ConfigService} configService - The configuration service for accessing environment variables.
  

   * @param {MessageService} messageService - The service for accessing message data.
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {
    super();
    this.logger.log('FinchService initialized');
  }

  /**
   * Generates a response based on the provided input and optional chatId.
   * Utilizes the LangChain OpenAI model for response generation, summarizing past messages
   * for context retention in the conversation.
   *
   * @param {string} input - The input message to be processed by Finch.
   * @param {string} [chatId] - Optional chat ID to include past conversation context.
   * @returns {Promise<string>} - The AI-generated response.
   */
  public async generateResponse(
    input: string,
    chatId?: string,
  ): Promise<string> {
    this.logger.verbose(`Generating response for input: ${input}`);

    const { OpenAI } = await dynamicImport('langchain/llms/openai');
    const { HumanMessage, AIMessage } = await dynamicImport('langchain/schema');
    const { ConversationSummaryMemory, ChatMessageHistory } =
      await dynamicImport('langchain/memory');
    const { LLMChain } = await dynamicImport('langchain/chains');
    const { PromptTemplate } = await dynamicImport('langchain/prompts');

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

    const prompt =
      PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. 
The AI is talkative and provides lots of specific details from its context. 
If the AI does not know the answer to a question,

it truthfully says it does not know.

Current conversation:
{history}
Human: {input}
AI:`);

    const memory = new ConversationSummaryMemory({
      llm: new OpenAI({
        openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
        modelName: 'gpt-3.5-turbo',
        temperature: 0,
      }),
      chatHistory: new ChatMessageHistory(pastMessages),
    });

    const chain = new LLMChain({
      llm: model,
      prompt,
      memory,
      verbose: false,
    });

    let result = await chain.call({ input });
    result = result?.text || 'No response from Finch bot.';

    this.logger.verbose(`Finch response: ${result}`);

    console.log({
      res: result,
      memory: await memory.loadMemoryVariables({}),
    });

    return result;
  }
}
