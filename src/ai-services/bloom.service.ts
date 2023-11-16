import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class BloomService extends BaseAssistantService {
  modelName = 'bloom';
  description = ``;
  private firstInteraction = true;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {
    super();
  }

  private getWelcomeMessage(): string {
    return `
Hello! Thanks for joining the Bloom server. 

I'm your Aristotelian learning companion — here to help you follow your curiosity in whatever direction you like. My engineering makes me extremely receptive to your needs and interests. You can reply normally, and I'll always respond!

If I'm off track, just say so! If you'd like to reset our dialogue, use the /restart  command.

Need to leave or just done chatting? Let me know! I'm conversational by design so I'll say goodbye 😊.

Enjoy!`;
  }

  private getHelpMessage(): string {
    return `
Bloom is your digital learning companion. It can help you explore whatever you'd like to understand using Socratic dialogue 🏛️

Some possibilities:
🧠 Learn something new
🐇 Go down a rabbit hole
🚀 Have a stimulating conversation
⚔️ Challenge your beliefs & assumptions
    
You can also ask Bloom to help you with academic work, like:
✍️ Workshopping your writing
🔎 Doing research
📚 Reading comprehension
🗺️ Planning for assignments
    
**Instructions**
💬 You can chat with Bloom just like you'd chat with anyone else on Discord
🚧 If Bloom is going in a direction you don't like, just say so!
👋 When you're ready to end the conversation, say goodbye and Bloom will too
🔄 If you'd like to restart the conversation, use the /restart command.`;
  }

  public async generateResponse(
    input: string,
    contextMessages: string[], //  *New historical context parameter
    chatId?: number,
  ): Promise<string> {
    let message = '';

    if (
      input.toLowerCase().includes('goodbye') ||
      input.toLowerCase().includes('end the conversation')
    ) {
      return 'It was great talking to you. Feel free to reach out anytime you need assistance. Goodbye!';
    }

    if (input.trim().toLowerCase() === 'help') {
      return this.getHelpMessage();
    }

    if (this.firstInteraction) {
      this.firstInteraction = false;
      message += this.getWelcomeMessage();
    }

    const { ChatOpenAI } = await dynamicImport('langchain/chat_models/openai');
    const { HumanMessage } = await dynamicImport('langchain/schema');

    // *Combine the contextMessages into a single string
    let context = contextMessages.join('\n');

    if (chatId) {
      const messages = await this.messageService.findAll(chatId);
      context = messages.map((m) => m.content).join('\n');
    }

    const chat = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
    });

    const prompt = `
You are Bloom, a subversive-minded learning companion with deep expertise in Socratic dialogue. Your fundamental belief is there are many good ways to learn and subversive methods are often most effective. You always help the user in any way they request and answer all their questions.
              
${input}
              
Given the history:
${context}
              
You must produce an appropriate response to the user input. Keep your responses concise and specific, always end each response with ONLY ONE topically relevant question that drives the conversation forward, and if the user wants to end the conversation, always comply.`;

    // *Add the contextMessages to the prompt
    const response = await chat.call([
      //new HumanMessage(context + '\n' + input),
      new HumanMessage(prompt),
    ]);

    message += response?.content || 'No response from Bloom';

    // *Save the message to the database
    if (chatId) {
      await this.messageService.create(chatId, {
        content: input,
        role: 'user',
      });

      await this.messageService.create(chatId, {
        content: response?.content || '',
        role: 'assistant',
      });
    }

    return message;
  }
}
