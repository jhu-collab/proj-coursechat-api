import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { MessageService } from 'src/message/message.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import * as Console from 'console';
import { Message } from '../message/message.entity';
import { AIMessage } from 'langchain/schema';
@Injectable()
export class AntEaterService extends BaseAssistantService {
  modelName = 'antEater';
  description = `AntEater is an AI assistant that has the ability to summarize conversation history, while also having a buffer of recent conversations 
    and holding a cache of messages so previous messages dont have to be grabbed on every instance.`;

  private chatHistoryCache = new Map<number, Array<any>>();

  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
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
    Console.log(typeof pastMessages);
    this.chatHistoryCache.set(chatId, pastMessages);
    Console.log('Finished updated');
    for (let [key, value] of this.chatHistoryCache) {
    }
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
    if (!this.chatHistoryCache.has(chatId)) {
      await this.updateChatHistoryCache(chatId);
    }
    const pastMessages: Message[] = this.chatHistoryCache.get(chatId) || [];
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
      chatHistory: new ChatMessageHistory(this.chatHistoryCache.get(chatId)),
    });

    const summaryMemory = new ConversationSummaryMemory({
      llm: model,
      maxTokenLimit: 50,
      memoryKey: 'conversationSummary',
      inputKey: 'input',
    });

    const memory = new CombinedMemory({
      memories: [bufferMemory, summaryMemory],
    });
    Console.log('Created memory objects');

    // Prompt Template
    const prompt =
      PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. 
The AI is talkative and provides lots of specific details from its context. 
If the AI does not know the answer to a question, it truthfully says it does not know.

Summary of conversation:
{conversationSummary}
Current conversation:
{chat_history}
Human: {input}
AI:`);

    // Create a Langchain chain
    const chain = new LLMChain({
      llm: model,
      prompt,
      memory,
      verbose: false,
    });
    Console.log('Before chain call');

    // Generate response

    const result = await chain.call({ input });
    Console.log('After chain call');

    console.log({
      res: result.text,
      memory: await memory.loadMemoryVariables({}),
    });

    // Update cache with new input
    if (chatId) {
      // Assuming the new message object needs to be constructed here
      const newMessage = new AIMessage(result.text);
      Console.log('Before push');
      this.chatHistoryCache.get(chatId).push(newMessage);
      Console.log('After Push');
    }

    return result?.text || 'No response from Ant.';
  }
}
