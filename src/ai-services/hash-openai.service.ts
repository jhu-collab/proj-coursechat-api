import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './base-assistant.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashOpenaiService extends BaseAssistantService {
  modelName = 'hash-openai';
  description = `Data Structures assistant which augments user prompts using openai's assistant in 'retrieval' mode. 
  This assistant has all lecture notes fed to it as additional context. Under the hood, openai uses retrieval-augmented 
  generation to generate the response.`;

  constructor(private readonly configService: ConfigService) {
    super();
  }

  public async generateResponse(input: string): Promise<string> {
    const { OpenAI } = await dynamicImport('openai');
    const { MessageContentText } = await dynamicImport(
      'openai/resources/beta/threads/messages/messages',
    );

    const openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    const assistantId = this.configService.get<string>('OPENAI_ASSISTANT_ID');
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: input,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
      instructions: `Be as concise as possible in your responses. 
      Convert LaTeX to unformatted text: convert "( \Omicron(\lg n) )" to "O(log n)". Always try
      to respond using information from the knowledge base. If the question isn't about data structures,
      reply with "I don't assist with anything unrelated to data structures". Limit your responses to 20 tokens.
      Don't include sources in your response. When asked for specific answer, give the answer first and then an explanation.`,
    });

    // Currently, openai wants us to retrieve the status repeatedly until the run is 'completed'
    let runStatus = (await openai.beta.threads.runs.retrieve(thread.id, run.id))
      .status;
    while (runStatus !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 500));
      runStatus = (await openai.beta.threads.runs.retrieve(thread.id, run.id))
        .status;
    }

    const messagesInThread = await openai.beta.threads.messages.list(thread.id);
    const responseTextObject = messagesInThread.data[0]
      .content[0] as typeof MessageContentText;
    return responseTextObject.text.value;
  }
}
