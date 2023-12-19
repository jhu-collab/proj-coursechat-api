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
  description = `Hash-supabase is a data structures assistant which augments user prompts using relevant lecture notes from Dr. Ali Madooei's 601.226 Data structures
  course, which are stored in a supabase vector store. This vector store has all lecture notes stored as chunked word embeddings. 
  Hash-supabase is stateless so it treats each incoming query independently. It is named after the most beloved data structure, the hash map.`;

  constructor(private readonly configService: ConfigService) {
    super();
  }

  public async generateResponse(input: string): Promise<string> {
    // Initialize openai client
    const { OpenAI } = await dynamicImport('langchain/llms/openai');
    const model = new OpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });

    // Initialize supabase clients
    const supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_ANON_KEY'),
    );

    // Get a SupabaseVectorStore object for an already created database table
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
    // The chain looks at similar documents in the vector store to augment the user's prompt with
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const res = await chain.call({
      query: `${input}. Be as concise as possible in your responses. 
      Convert LaTeX to unformatted text: convert "( \Omicron(\lg n) )" to "O(log n)". Always try
      to respond using information from the knowledge base. If the question isn't about data structures,
      reply with "I don't assist with anything unrelated to data structures". Limit your responses to 20 tokens.
      Don't include sources in your response. When asked for specific answer, give the answer first and then an explanation.`,
    });
    return res.text;
  }
}
