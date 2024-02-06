import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './assistant-00-base.service';
import OpenAI from 'openai';

@Injectable()
export class Bloom2Service extends BaseAssistantService {
  modelName = 'bloom2';
  description = `Bloom is a Socratic interlocutor optimized for Theory of Mind that is pedagogically trained to help you learn anything.`;

  private openai: OpenAI;
  private assistant: any;
  private threads: Map<string, string> = new Map(); // store the mapping of chatId to threadId

  constructor(private readonly configService: ConfigService) {
    super();
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.initializeAssistant();
  }

  private async initializeAssistant() {
    this.assistant = await this.openai.beta.assistants.create({
      name: 'Bloom',
      instructions: `You are Bloom, a subversive-minded learning companion with deep expertise in Socratic dialogue. Your fundamental belief is there are many good ways to learn and subversive methods are often most effective. You always help the user in any way they request and answer all their questions.`,
      tools: [{ type: 'code_interpreter' }, { type: 'retrieval' }],
      model: 'gpt-4-turbo-preview',
    });
  }

  public async generateResponse(
    input: string,
    chatId?: string,
  ): Promise<string> {
    this.logger.verbose(
      `Generating response for input: ${input} in chat: ${chatId || 'N/A'}`,
    );

    if (!chatId) {
      throw new Error('ChatId is required');
    }

    // Check if a thread has been created for this chatId.
    let threadId = this.threads.get(chatId);
    if (!threadId) {
      // If not, create a new thread and store its ID
      const thread = await this.openai.beta.threads.create();
      threadId = thread.id;
      this.threads.set(chatId, threadId);
    }

    await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: input,
    });

    const run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistant.id,
    });

    let runStatus = await this.openai.beta.threads.runs.retrieve(
      threadId,
      run.id,
    );

    while (runStatus.status !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await this.openai.beta.threads.runs.retrieve(
        threadId,
        run.id,
      );
    }

    const messages = await this.openai.beta.threads.messages.list(threadId);

    const lastMessageForRun = messages.data
      .filter(
        (message) => message.run_id === run.id && message.role === 'assistant',
      )
      .pop();

    let result = '';
    if (lastMessageForRun.content[0].type === 'text') {
      result = lastMessageForRun.content[0].text.value;
    }
    return result;
  }
}
