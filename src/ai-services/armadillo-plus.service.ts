import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import { MessageService } from 'src/message/message.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { type PoolConfig } from 'pg';
import { PGVectorStore } from 'langchain/dist/vectorstores/pgvector';

@Injectable()
export class ArmadilloPlusService extends BaseAssistantService {
  modelName = 'armadillo-plus';
  description = `armadilloPlus is an AI assistant that has the ability to store messages into a vectorDB for retrieval. While caching these augmented vector storages`;
  chatHistoryEmbedding: PGVectorStore = null;

  retrievalNumber = 3;
  cacheReloadTimer = 3600;
  currentPastMessages = [];
  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super();
  }

  public async initializeChatHistoryEmbedding() {
    const { OpenAIEmbeddings } = await dynamicImport(
      'langchain/embeddings/openai',
    );
    const { PGVectorStore } = await dynamicImport(
      'langchain/vectorstores/pgvector',
    );
    const config = {
      postgresConnectionOptions: {
        type: 'postgres',
        host: this.configService.get<string>('DB_HOST'),
        port: this.configService.get<string>('DB_PORT'),
        user: this.configService.get<string>('DB_USER'),
        password: this.configService.get<string>('DB_PASSWORD'),
        database: this.configService.get<string>('DB_NAME'),
      } as PoolConfig,
      tableName: 'EmbedMessages',
      columns: {
        idColumnName: 'id',
        vectorColumnName: 'embedding',
        contentColumnName: 'content',
        metadataColumnName: 'metadata',
      },
    };

    this.chatHistoryEmbedding = await PGVectorStore.initialize(
      new OpenAIEmbeddings(),
      config,
    );
  }

  private async updateChatHistoryCache(chatId: number) {
    const { HumanMessage, AIMessage } = await dynamicImport('langchain/schema');
    const pastMessagesEmbedding: any = [];
    const pastMessagesBuffer: any = [];
    const messages = await this.messageService.findAll(chatId);
    await this.initializeChatHistoryEmbedding();
    messages.forEach((m) => {
      const messageDocument = {
        pageContent: m.content,
        metadata: { role: m.role, chatID: m.chatId },
      };
      pastMessagesEmbedding.push(messageDocument);
      if (m.role === 'user') {
        pastMessagesBuffer.push(new HumanMessage(m.content));
      } else if (m.role === 'assistant') {
        pastMessagesBuffer.push(new AIMessage(m.content));
      }
    });
    await this.chatHistoryEmbedding.addDocuments(pastMessagesEmbedding);
    this.currentPastMessages = pastMessagesBuffer;

    const storedTuple = [this.chatHistoryEmbedding, pastMessagesBuffer];
    await this.cacheManager.set(
      `chatHistory_${chatId}`,
      storedTuple,
      this.cacheReloadTimer,
    );
  }

  public async generateResponse(
    input: string,
    chatId?: number,
  ): Promise<string> {
    const { OpenAI } = await dynamicImport('langchain/llms/openai');
    const { PromptTemplate } = await dynamicImport('langchain/prompts');
    const { LLMChain } = await dynamicImport('langchain/chains');
    const {
      VectorStoreRetrieverMemory,
      BufferMemory,
      CombinedMemory,
      ChatMessageHistory,
    } = await dynamicImport('langchain/memory');
    const { AIMessage } = await dynamicImport('langchain/schema');

    // Retrieve or update chat history from cache
    const cachedData: any[] = await this.cacheManager.get(
      `chatHistory_${chatId}`,
    );
    if (cachedData) {
      [this.chatHistoryEmbedding, this.currentPastMessages] = cachedData;
    } else {
      await this.updateChatHistoryCache(chatId);
    }

    // Initialize OpenAI model
    const model = new OpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
    });

    const vectorMemory = new VectorStoreRetrieverMemory({
      // 1 is how many documents to return, you might want to return more, eg. 4
      vectorStoreRetriever: this.chatHistoryEmbedding.asRetriever(
        this.retrievalNumber,
        { chatId },
      ),
      memoryKey: 'vector_chat_history',
      verbose: true,
    });

    const bufferMemory = new BufferMemory({
      memoryKey: 'chat_history',
      inputKey: 'input',
      chatHistory: new ChatMessageHistory(this.currentPastMessages),
      verbose: true,
    });

    // Prompt Template
    const prompt =
      PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. 
The AI is talkative and provides lots of specific details from its context. 
If the AI does not know the answer to a question, it truthfully says it does not know.

Vector stored relevant conversation:
{vector_chat_history}
Buffer conversation:
{chat_history}
Input: {input}
AI:`);

    const memory = new CombinedMemory({
      memories: [vectorMemory, bufferMemory],
    });

    const chain = new LLMChain({
      llm: model,
      prompt,
      memory,
      verbose: true,
    });

    // Generate response
    const result = await chain.call({ input });

    await this.chatHistoryEmbedding.addDocuments([
      {
        pageContent: result.text,
        metadata: { role: 'assistant', chatID: chatId },
      },
    ]);
    this.currentPastMessages.push(new AIMessage(result));
    await this.cacheManager.set(
      `chatHistory_${chatId}`,
      [this.chatHistoryEmbedding, this.currentPastMessages],
      this.cacheReloadTimer,
    );

    return result?.text || 'No response from Ant.';
  }
}
