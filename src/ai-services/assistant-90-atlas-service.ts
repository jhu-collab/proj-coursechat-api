import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './assistant-00-base.service';
import { dynamicImport } from 'src/ai-services/assistant.utils';
import { MessageService } from 'src/message/message.service';
import { Client } from 'langsmith';

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
    @Inject('LANGSMITH_CLIENT') private readonly client: Client,
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

    const { LangChainTracer } = await dynamicImport(
      '@langchain/core/tracers/tracer_langchain',
    );
    // Initialize the LangChainTracer
    const tracer = new LangChainTracer({
      projectName: 'atlas-spring-24',
      client: this.client,
    });

    const { StringOutputParser } = await dynamicImport(
      '@langchain/core/output_parsers',
    );
    const parser = new StringOutputParser();

    const { ChatOpenAI } = await dynamicImport('@langchain/openai');
    const chatModel = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-4-1106-preview',
      temperature: 0,
      streaming: true,
      verbose: false,
    });

    const { ChatMessageHistory } = await dynamicImport('langchain/memory');
    const chatHistory = new ChatMessageHistory();

    if (chatId) {
      // The last message is the user's input
      // The two messages before that are the user's input and the assistant's output respectively
      // which are not yet stored in the redis memory
      const messages = await this.messageService.findLatestMessages(chatId, 17);

      for (let i = 0; i < messages.length - 1; i = i + 2) {
        await chatHistory.addUserMessage(messages[i].content);
        await chatHistory.addAIChatMessage(messages[i + 1].content);
      }
    }

    const SYSTEM_STRING = `You are a Teaching Assistant for EN.601.501 Computer Science Workshop at Johns Hopkins University. This course emphasizes self-directed and self-regulated learning, aimed at enhancing coding skills through solving challenges on LeetCode. It revolves around completing 150 selected LeetCode problems (NeetCode 150) with a goal of solving at least 50 problems for 1 credit or 100 problems for 2 credits. 

Your role is to assist students with questions related to coding problems, offering guidance, motivation, and tailored feedback  based on their individual queries and skill levels. Provide detailed, informative, and clear responses, maintaining a polite and  professional tone. If unsure of an answer, kindly admit so and suggest how students might find the information they need. 

If additional information from the student is required to provide a helpful response, please request it clearly. Remember, this course is not just about earning credits; it's a commitment to a journey that sharpens crucial problem-solving  abilities for technical interviews and future careers in software development. Your support is key to helping students  navigate this journey successfully.`;

    const { ChatPromptTemplate, MessagesPlaceholder } = await dynamicImport(
      '@langchain/core/prompts',
    );
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_STRING],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);

    const { RunnableWithMessageHistory } = await dynamicImport(
      '@langchain/core/runnables',
    );
    const chain = new RunnableWithMessageHistory({
      runnable: prompt.pipe(chatModel).pipe(parser),
      getMessageHistory: (sessionId) => chatHistory,
      historyMessagesKey: 'history',
      inputMessagesKey: 'input',
    });

    const stream = await chain.stream(
      { input },
      { callbacks: [tracer], configurable: { sessionId: chatId } },
    );

    return stream;
  }
}
