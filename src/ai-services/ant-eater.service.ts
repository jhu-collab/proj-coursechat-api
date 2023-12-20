import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { MessageService } from 'src/message/message.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import { Message } from '../message/message.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class AntEaterService extends BaseAssistantService {
  modelName = 'ant-eater';
  description = `AntEater is an AI assistant that has the ability to summarize conversation history, while also having a buffer of recent conversations 
    and holding a cache of messages so previous messages dont have to be grabbed on every instance.`;

  cacheReloadTimer = 3600;
  maxTokenLimit = 50;
  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super();
  }

  private async updateChatHistoryCache(chatId: number) {
    const { HumanMessage, AIMessage } = await dynamicImport('langchain/schema');
    const pastMessages = [];
    const messages = await this.messageService.findAll(chatId);
    messages.forEach((m) => {
      if (m.role === 'user') {
        pastMessages.push(new HumanMessage(m.content));
      } else if (m.role === 'assistant') {
        pastMessages.push(new AIMessage(m.content));
      }
    });
    await this.cacheManager.set(
      `chatHistory_${chatId}`,
      pastMessages,
      this.cacheReloadTimer,
    );
  }

  public async generateResponse(
    input: string,
    chatId?: number,
  ): Promise<string> {
    const { OpenAI } = await dynamicImport('langchain/llms/openai');
    const {
      ConversationSummaryMemory,
      BufferMemory,
      CombinedMemory,
      ChatMessageHistory,
    } = await dynamicImport('langchain/memory');
    const { LLMChain } = await dynamicImport('langchain/chains');
    const { PromptTemplate } = await dynamicImport('langchain/prompts');

    // Retrieve or update chat history from cache
    if (!(await this.cacheManager.get(`chatHistory_${chatId}`))) {
      await this.updateChatHistoryCache(chatId);
    }
    const pastMessages: Message[] =
      (await this.cacheManager.get(`chatHistory_${chatId}`)) || [];

    // Initialize OpenAI model
    const model = new OpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
    });

    const bufferMemory = new BufferMemory({
      memoryKey: 'chat_history',
      inputKey: 'input',
      chatHistory: new ChatMessageHistory(pastMessages),
    });

    const summaryMemory = new ConversationSummaryMemory({
      llm: model,
      maxTokenLimit: this.maxTokenLimit,
      memoryKey: 'conversationSummary',
      inputKey: 'input',
    });

    const memory = new CombinedMemory({
      memories: [bufferMemory, summaryMemory],
    });

    // Prompt Template
    const prompt =
      PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. 
The AI is talkative and provides lots of specific details from its context. 
If the AI does not know the answer to a question, it truthfully says it does not know.

Summary of conversation:
{conversationSummary}
Current conversation:
{chat_history}
Input: {input}
AI:`);

    // Create a Langchain chain
    const chain = new LLMChain({
      llm: model,
      prompt,
      memory,
      verbose: true,
    });

    // Generate response

    const result = await chain.call({ input });

    return result?.text || 'No response from Ant.';
  }
}
