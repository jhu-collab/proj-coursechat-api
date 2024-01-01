import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { MessageService } from 'src/message/message.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';

@Injectable()
export class FinchService extends BaseAssistantService {
  modelName = 'finch';
  description = `Finch is an AI assistant that has the ability to summarize conversation history 
to  generate responses based on both the conversation summary and the current input. 
It is not good at remembering details but it is good at maintaining the context of the conversation.
Named after Atticus Finch (Fictional Character) from Harper Lee's "To Kill a Mockingbird," 
Finch is known for summarizing moral and ethical dilemmas in a way that is both profound and accessible.`;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {
    super();
  }

  public async generateResponse(
    input: string,
    chatId?: string,
  ): Promise<string> {
    const { OpenAI } = await dynamicImport('langchain/llms/openai');
    const { HumanMessage, AIMessage } = await dynamicImport('langchain/schema');
    const { ConversationSummaryMemory, ChatMessageHistory } =
      await dynamicImport('langchain/memory');
    const { LLMChain } = await dynamicImport('langchain/chains');
    const { PromptTemplate } = await dynamicImport('langchain/prompts');

    // This simple implementation iterates over all messages in the chat history.
    // This implementation does not cache the chat history so every follow up
    // request will have to recompute the entire chat history.
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
    }

    const model = new OpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
    });

    // Using the default prompt from the example on Langchain website
    const prompt =
      PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. 
The AI is talkative and provides lots of specific details from its context. 
If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
{history}
Human: {input}
AI:`);

    // CAUTION: The example on the Langchain website uses a custom memoryKey but
    // that does not work (probably a bug on their side). So keep the memoryKey as 'history'.
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
    const result = await chain.call({ input });

    console.log({
      res: result.text,
      memory: await memory.loadMemoryVariables({}),
    });

    return result?.text || 'No response from Finch bot.';
  }
}
