import { Injectable } from '@nestjs/common';
import { BaseAssistantService } from './base-assistant.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashOpenaiService extends BaseAssistantService {
  modelName = 'hash-openai';
  description = `Hash-openai is a data structures assistant which augments user prompts using openai's assistant in 'retrieval' mode. 
  It has all lecture notes from Dr. Ali Madooei's 601.226 Data structures course fed to it as additional context. Under the hood, openai 
  uses retrieval-augmented generation to generate the response. Hash-openai is stateless so it treats each incoming query independently. 
  It is named after the most beloved data structure, the hash map.`;

  constructor(private readonly configService: ConfigService) {
    super();
  }

  public async generateResponse(input: string): Promise<string> {
    const { OpenAI } = await dynamicImport('openai');
    const { MessageContentText } = await dynamicImport(
      'openai/resources/beta/threads/messages/messages',
    );

    // Note: unlike in other files, this constructor is from the openai package, NOT from langchain
    const model = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    // Get the existing openai assistant's id. This assistant already has access to all the lecture notes.
    const assistantId = this.configService.get<string>('OPENAI_ASSISTANT_ID');

    // Create a thread: every conversation with an openai assistant starts with a thread: https://platform.openai.com/docs/assistants/overview
    const thread = await model.beta.threads.create();

    // Add a message to the thread
    await model.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: input,
    });

    const run = await model.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
      instructions: `Be as concise as possible in your responses. 
      Convert LaTeX to unformatted text: convert "( \Omicron(\lg n) )" to "O(log n)". Always try
      to respond using information from the knowledge base. If the question isn't about data structures,
      reply with "I don't assist with anything unrelated to data structures". Limit your responses to 20 tokens.
      Don't include sources in your response. When asked for specific answer, give the answer first and then an explanation.`,
    });

    // Keep polling for the run status every 0.5s until it has 'completed'. Unfortunately, openai doesn't provide a webhook at the moment
    // Reference: https://platform.openai.com/docs/assistants/overview/step-5-check-the-run-status
    let runStatus = (await model.beta.threads.runs.retrieve(thread.id, run.id))
      .status;
    while (runStatus !== 'completed') {
      await new Promise((resolve) => setTimeout(resolve, 500));
      runStatus = (await model.beta.threads.runs.retrieve(thread.id, run.id))
        .status;
    }
    // Pull out the response from the thread and return it
    const messagesInThread = await model.beta.threads.messages.list(thread.id);
    const responseTextObject = messagesInThread.data[0]
      .content[0] as typeof MessageContentText;
    return responseTextObject.text.value;
  }
}
