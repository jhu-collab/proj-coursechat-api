import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import { MessageService } from 'src/message/message.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Message } from '../message/message.entity';

@Injectable()
export class AntEaterPlusService extends BaseAssistantService {
  modelName = 'ant-eater-plus';
  description = `ant-eater-plus is an AI assistant that has the ability to store messages into a vectorDB for retrieval. While caching these augmented vector storages`;
  chatHistoryEmbedding: any = null;

  retrievalNumber = 3;
  cacheReloadTimer = 3600;
  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super();
    this.initializeChatHistoryEmbedding();
  }

  public async initializeChatHistoryEmbedding() {
    const { MemoryVectorStore } = await dynamicImport(
      'langchain/vectorstores/memory',
    );
    const { VectorStoreRetrieverMemory } =
      await dynamicImport('langchain/memory');
    const { OpenAIEmbeddings } = await dynamicImport(
      'langchain/embeddings/openai',
    );
    const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
    this.chatHistoryEmbedding = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: vectorStore.asRetriever(this.retrievalNumber),
      memoryKey: 'chat_history',
    });
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
    const { LLMChain } = await dynamicImport('langchain/chains');
    const { PromptTemplate } = await dynamicImport('langchain/prompts');
    const { AIMessage } = await dynamicImport('langchain/schema');
    const memory = this.chatHistoryEmbedding;

    // Retrieve or update chat history from cache
    if (!(await this.cacheManager.get(`chatHistory_${chatId}`))) {
      await this.updateChatHistoryCache(chatId);
    }
    const pastMessages: Message[] =
      (await this.cacheManager.get(`chatHistory_${chatId}`)) || [];

    const halfLength = Math.floor(pastMessages.length / 2);
    for (let i = 0; i <= halfLength; i += 2) {
      // Check if both current (i) and next (i+1) messages exist
      if (i + 1 < pastMessages.length) {
        await memory.saveContext(
          { input: pastMessages[i] },
          { output: pastMessages[i + 1] },
        );
      } else if (i < pastMessages.length) {
        // Handle the case where the array length is odd
        // Save the last message without a pair
        await memory.saveContext({ input: pastMessages[i] }, { output: '' });
      }
    }

    // Initialize OpenAI model
    const model = new OpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
    });

    // Prompt Template
    const prompt =
      PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. 
The AI is talkative and provides lots of specific details from its context. 
If the AI does not know the answer to a question, it truthfully says it does not know.

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
    pastMessages.push(new AIMessage(result.text));
    await this.cacheManager.set(
      `chatHistory_${chatId}`,
      pastMessages,
      this.cacheReloadTimer,
    );

    return result?.text || 'No response from Ant.';
  }
}
