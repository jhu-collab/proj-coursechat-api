import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { MessageService } from 'src/message/message.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';

@Injectable()
export class AntService extends BaseAssistantService {
  modelName = 'ant';
  description = `Ant is an AI assistant that has the ability to summarize conversation history 
to summarize previous conversations. While also holding a buffer of previous messages`;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {
    super();
  }

  public async generateResponse(
    input: string,
    chatId?: number,
  ): Promise<string> {
    const { OpenAI } = await dynamicImport('langchain/llms/openai');
    const { HumanMessage, AIMessage } = await dynamicImport('langchain/schema');
    const {
      BufferMemory,
      ConversationSummaryBufferMemory,
      CombinedMemory,
      ChatMessageHistory,
    } = await dynamicImport('langchain/memory');
    const { LLMChain } = await dynamicImport('langchain/chains');
    const { PromptTemplate } = await dynamicImport('langchain/prompts');

    // Retrieve chat history
    const pastMessages = [];
    if (chatId) {
      const messages = await this.messageService.findAll(chatId);
      messages.forEach((m) => {
        if (m.role === 'user') {
          pastMessages.push(new HumanMessage(m.content));
        } else if (m.role === 'assistant') {
          pastMessages.push(new AIMessage(m.content));
        }
      });
    }

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

    // Initialize memory with ConversationSummaryBufferMemory
    const maxToken = 50;
    const summaryMemory = new ConversationSummaryBufferMemory({
      llm: model,
      maxTokenLimit: maxToken,
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

    console.log({
      res: result.text,
      memory: await memory.loadMemoryVariables({}),
    });

    return result?.text || 'No response from Ant.';
  }
}
