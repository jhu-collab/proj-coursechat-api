import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import * as Console from 'console';

@Injectable()
export class AntEaterPlusService extends BaseAssistantService {
  modelName = 'antEaterPlus';
  description = `AntEater is an AI assistant that has the ability to store messages into a vectorDB for retrieval.`;
  chatHistoryEmbedding: any = null;

  constructor(private readonly configService: ConfigService) {
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
    const retrievalNumber = 3;
    this.chatHistoryEmbedding = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: vectorStore.asRetriever(retrievalNumber),
      memoryKey: 'chat_history',
    });
  }
  public async generateResponse(
    input: string,
    chatId?: number,
  ): Promise<string> {
    const { OpenAI } = await dynamicImport('langchain/llms/openai');
    const { LLMChain } = await dynamicImport('langchain/chains');
    const { PromptTemplate } = await dynamicImport('langchain/prompts');

    const memory = this.chatHistoryEmbedding;

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

Summary of conversation:
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

    // Generate response

    const result = await chain.call({ input });

    const { AIMessage } = await dynamicImport('langchain/schema');
    const newMessage = new AIMessage(result.text);
    await memory.saveContext({ input }, { newMessage });
    Console.log('After Push');

    return result?.text || 'No response from Ant.';
  }
}
