import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { MessageService } from 'src/message/message.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';

@Injectable()
export class MementoService extends BaseAssistantService {
  modelName = 'memento';
  description = `Memento is an AI assistant that has the ability to remember 
conversation history. It can generate responses based on both the conversation 
history and the current input.
Similar to the movie Memento, this agent has short-term memory loss and can only 
remember the last few messages in the conversation history.`;

  numberOfMessagesToRemember = 6;

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
    const { BufferWindowMemory, ChatMessageHistory } =
      await dynamicImport('langchain/memory');
    const { ConversationChain } = await dynamicImport('langchain/chains');

    // This simple implementation iterates over all messages in the chat history.
    // Since we only keep numberOfMessagesToRemember messages in the memory,
    //  we could limit the iteration to the last numberOfMessagesToRemember messages.
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

    const memory = new BufferWindowMemory({
      k: this.numberOfMessagesToRemember,
      chatHistory: new ChatMessageHistory(pastMessages),
    });

    const chain = new ConversationChain({ llm: model, memory: memory });
    const result = await chain.call({ input });

    return result?.response || 'No response from Memento bot.';
  }
}
