import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';

@Injectable()
export class BadgerService extends BaseAssistantService {
  modelName = 'badger';
  description = `Badger is an AI assistant that has the ability to store messages into a vectorDB for retrieval combined with having a message buffer to store some very recent messages. The messages from the DB is cached.`;
  chatHistoryEmbedding: any = null;
  longMemory: any = null;
  private chatHistoryCache = new Map<number, any>();

  constructor(private readonly configService: ConfigService) {
    super();
  }

  public async initializeChatHistoryEmbedding() {
    const { MemoryVectorStore } = await dynamicImport(
      'langchain/vectorstores/memory',
    );
    const { VectorStoreRetrieverMemory, BufferMemory, CombinedMemory } =
      await dynamicImport('langchain/memory');
    const { OpenAIEmbeddings } = await dynamicImport(
      'langchain/embeddings/openai',
    );
    const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
    const retrievalNumber = 3;
    this.chatHistoryEmbedding = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: vectorStore.asRetriever(retrievalNumber),
      memoryKey: 'embedding_chat_history',
      inputKey: 'input',
    });

    const bufferMemory = new BufferMemory({
      memoryKey: 'chat_history',
      inputKey: 'input',
      chat_history: '',
    });
    this.longMemory = new CombinedMemory({
      memories: [this.chatHistoryEmbedding, bufferMemory],
    });
  }
  public async generateResponse(
    input: string,
    chatId?: number,
  ): Promise<string> {
    const { OpenAI } = await dynamicImport('langchain/llms/openai');
    const { LLMChain } = await dynamicImport('langchain/chains');
    const { PromptTemplate } = await dynamicImport('langchain/prompts');

    if (!this.chatHistoryCache.has(chatId)) {
      await this.initializeChatHistoryEmbedding();
      this.chatHistoryCache.set(chatId, this.longMemory);
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

Embedding Similarit Messages:
{embedding_chat_history}
Current conversation Buffer:
{chat_history}
Human: {input}
AI:`);
    const memory = this.chatHistoryCache.get(chatId);
    // Create a Langchain chain
    const chain = new LLMChain({
      llm: model,
      prompt,
      memory,
      verbose: false,
    });

    // Generate response

    const result = await chain.call({ input });

    const { AIMessage } = await dynamicImport('langchain/schema');
    const newMessage = new AIMessage(result.text);
    await this.longMemory.saveContext({ input }, { newMessage });

    return result?.text || 'No response from Ant.';
  }
}
