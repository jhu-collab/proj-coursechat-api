import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class ElephantService extends BaseAssistantService {
  modelName = 'elephant';
  description = `It is said that 'elephants never forget.'
Elephant is an AI assistant that tries to remember the entire history of a conversation.
But it is not a sophisticated model as it can max out the prompt limit of OpenAI API 
by trying to remember too much.`;

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
    const { BufferMemory, ChatMessageHistory } =
      await dynamicImport('langchain/memory');
    const { ConversationChain } = await dynamicImport('langchain/chains');

    // This simple implementation iterates over all messages in the chat history.
    // This can cause the prompt to exceed the limit of tokens.
    // Moreover, this implementation does not cache the chat history so every follow up
    // request will have to recompute the entire chat history.
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

    const model = new OpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
    });

    const memory = new BufferMemory({
      chatHistory: new ChatMessageHistory(pastMessages),
    });

    const chain = new ConversationChain({ llm: model, memory: memory });
    const result = await chain.call({ input });
    console.log(await memory.loadMemoryVariables({}));

    return result?.response || 'No response from Elephant bot.';
  }
}
