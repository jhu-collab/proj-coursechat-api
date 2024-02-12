import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './assistant-00-base.service';
import { dynamicImport } from 'src/ai-services/assistant.utils';
import { MessageService } from 'src/message/message.service';
import { Redis } from '@upstash/redis';

@Injectable()
export class AtlasService extends BaseAssistantService {
  modelName = 'Atlas';
  description = `Named after the mythological figure who carries the heavens, 
Atlas is your steadfast support in navigating the complex world of coding. 
This AI assistant provides direct, straightforward assistance, 
similar to ChatGPT, offering clear explanations, hints, and code snippets to 
help you tackle coding problems head-on. 
Whether you're stuck on a specific challenge or seeking to understand broader 
concepts, Atlas is designed to provide the support you need with precision 
and clarity. Turn to Atlas for guidance that's as reliable as it is enlightening, 
helping you build confidence and competence in your coding journey.`;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {
    super();
    this.logger.log('Atlas initialized');
  }

  public async generateResponse(
    input: string,
    chatId?: string,
  ): Promise<string> {
    this.logger.verbose(
      `Generating response for input: ${input} in chat: ${chatId || 'N/A'}`,
    );

    const { ChatOpenAI } = await dynamicImport('@langchain/openai');
    const { StringOutputParser } = await dynamicImport(
      '@langchain/core/output_parsers',
    );
    const { ConversationSummaryBufferMemory } =
      await dynamicImport('langchain/memory');
    const { UpstashRedisChatMessageHistory } = await dynamicImport(
      '@langchain/community/stores/message/upstash_redis',
    );
    const { ChatPromptTemplate, MessagesPlaceholder } = await dynamicImport(
      '@langchain/core/prompts',
    );
    const { RunnableSequence } = await dynamicImport(
      '@langchain/core/runnables',
    );

    const parser = new StringOutputParser();

    const chatModel = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-4-1106-preview',
      temperature: 0,
      streaming: true,
      verbose: false,
    });

    const summaryModel = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
      verbose: false,
    });

    const memory = new ConversationSummaryBufferMemory({
      returnMessages: true,
      inputKey: 'input',
      outputKey: 'output',
      memoryKey: 'history',
      chatHistory: new UpstashRedisChatMessageHistory({
        sessionId: chatId || new Date().toLocaleDateString(), // TODO - this should only be used when we have chatId,
        //      and should be removed when we have a proper sessionId
        client: new Redis({
          url: this.configService.get<string>('UPSTASH_REDIS_REST_URL'),
          token: this.configService.get<string>('UPSTASH_REDIS_REST_TOKEN'),
        }),
      }),
      llm: summaryModel,
      maxTokenLimit: 2000,
    });

    console.log(await memory.loadMemoryVariables({}));

    if (chatId) {
      // The last message is the user's input
      // The two messages before that are the user's input and the assistant's output respectively
      // which are not yet stored in the redis memory
      const messages = await this.messageService.findLatestMessages(chatId, 3);
      // FIXME: The assumption is that the last two messages are from the user and the assistant
      if (messages.length === 3) {
        this.logger.verbose(
          `Fetched ${messages.length} past messages for chat: ${chatId}`,
        );
        await memory.saveContext(
          { input: messages[0].content },
          { output: messages[1].content },
        );

        console.log(await memory.loadMemoryVariables({}));

        // We don't need to save the last message as it is the user's input
        // and we are already using it as the input to the assistant
      } else {
        this.logger.warn(
          `Expected 3 messages for chat: ${chatId}, but got ${messages.length}`,
        );
      }
    }

    const SYSTEM_STRING = `You are a Teaching Assistant for EN.601.501 Computer Science Workshop at Johns Hopkins University,  instructed by Dr. Ali Madooei. This course emphasizes self-directed and self-regulated learning, aimed at enhancing coding  skills through solving challenges on LeetCode. It revolves around completing 150 selected LeetCode problems (NeetCode 150)  with a goal of solving at least 50 problems for 1 credit or 100 problems for 2 credits.

Your role is to assist students with questions related to coding problems, offering guidance, motivation, and tailored feedback  based on their individual queries and skill levels. Provide detailed, informative, and clear responses, maintaining a polite and  professional tone. If unsure of an answer, kindly admit so and suggest how students might find the information they need.  If additional information from the student is required to provide a helpful response, please request it clearly.

Remember, this course is not just about earning credits; it's a commitment to a journey that sharpens crucial problem-solving  abilities for technical interviews and future careers in software development. Your support is key to helping students  navigate this journey successfully.`;

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_STRING],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);

    const chain = RunnableSequence.from([
      {
        input: (initialInput) => initialInput.input,
        memory: () => memory.loadMemoryVariables({}),
      },
      {
        input: (previousOutput) => previousOutput.input,
        history: (previousOutput) => previousOutput.memory.history,
      },
      prompt,
      chatModel,
      parser,
    ]);

    const stream = await chain.stream({ input });

    return stream;
  }
}
