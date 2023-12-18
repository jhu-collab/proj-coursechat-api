import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './base-assistant.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import { ConfigService } from '@nestjs/config';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { createClient } from '@supabase/supabase-js';
import { RetrievalQAChain } from 'langchain/chains';

@Injectable()
export class HashSupabaseService extends BaseAssistantService {
  modelName = 'hash-supabase';
  description = `Data structures assistant which augments user prompts using relevant lecture notes stored in a supabase vector store.
  This vector store has all lecture notes stored as chunked word embeddings`;

  constructor(private readonly configService: ConfigService) {
    super();
  }

  // Override other shared methods and properties as needed, or use the ones from BaseAssistantService.
  public async generateResponse(input: string): Promise<string> {
    const supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_ANON_KEY'),
    );

    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      }),
      {
        tableName: 'documents',
        queryName: 'match_documents',
        client: supabase,
      },
    );

    const { OpenAI } = await dynamicImport('langchain/llms/openai');
    const model = new OpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    const vectorStoreRetriever = vectorStore.asRetriever();

    const template = `Be as concise as possible in your responses. 
Convert LaTeX to unformatted text: convert "( \Omicron(\lg n) )" to "O(log n)". Always try
to respond using information from the knowledge base. If the question isn't about data structures,
reply with "I don't assist with anything unrelated to data structures". Limit your responses to 20 tokens.
Don't include sources in your response. When asked for specific answer, give the answer first and then an explanation.`;
    // const chatPrompt = ChatPromptTemplate.fromMessages([["system", template]]);
    // // Create a chain that uses the OpenAI LLM
    const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever, {});
    const res = await chain.call({
      // get the LLM response
      query: `${input}. ${template}`,
    });
    return res.text;
  }
}
