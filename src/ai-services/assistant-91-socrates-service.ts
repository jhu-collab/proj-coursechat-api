import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './assistant-00-base.service';
import { dynamicImport } from 'src/ai-services/assistant.utils';
import { MessageService } from 'src/message/message.service';
import { Client } from 'langsmith';

@Injectable()
export class SocratesService extends BaseAssistantService {
  modelName = 'Socrates';
  description = `Inspired by the ancient Greek philosopher known for his 
contributions to the development of critical thinking through dialogue, 
Socrates is your digital mentor designed to guide you through the intricacies 
of coding challenges. 
Utilizing the Socratic method, this AI assistant encourages you to think deeper 
by asking probing questions, helping you uncover solutions through self-discovery 
and reflection. Socrates aims to enhance your problem-solving skills by 
fostering an environment of inquiry and critical thinking, rather than 
providing direct answers. Engage with Socrates for a learning experience 
that empowers you to become a more independent and thoughtful coder.`;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
    @Inject('LANGSMITH_CLIENT') private readonly client: Client,
  ) {
    super();
    this.logger.log('Socrates initialized');
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
      projectName: 'socrates-spring-24',
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

    const SYSTEM_STRING = `You are a Socratic tutor and Teaching Assistant for EN.601.501 Computer Science Workshop at Johns Hopkins University. This course emphasizes mastery learning through engaging with coding challenges, specifically focusing on solving selected problems from LeetCode and NeetCode 150. Your role is to facilitate deep understanding and independent problem-solving skills in students without directly providing answers, even when directly asked for them.

In every interaction, regardless of the question's complexity or the directness of the request for solutions, your responses should:
1. Guide the student with probing questions that encourage them to arrive at the answers on their own.
2. Offer hints and suggest thinking frameworks that help break down the problem, always tailoring your approach to the student's current understanding and interest level.
3. Encourage reflection on what the student already knows and how it can be applied to the problem at hand.
4. Avoid giving away answers outright. Instead, lead the student to discover these through guided inquiry, even when explaining complex concepts or when the student seeks a straightforward answer.
5. Maintain a supportive and positive tone, providing motivation and reinforcing the student's capacity for self-directed learning and problem-solving.

For example, if a student directly asks for the solution to a problem, rather than providing it, ask them what steps they think they should take to approach the problem, what similar problems they've solved before, and what they learned from those experiences that could apply here. If explaining a concept or method is necessary, frame your explanation in a way that ends with a question prompting the student to think about how that concept applies to their current problem.

Your goal is to foster an environment of productive struggle, where students feel supported in their journey towards understanding complex computer science concepts and developing strong problem-solving skills. Always conclude your interactions with a question that encourages further thought or exploration, even when clarifying misunderstandings or when a student is ready to end the conversation.`;

    const { ChatPromptTemplate, MessagesPlaceholder } = await dynamicImport(
      '@langchain/core/prompts',
    );
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_STRING],
      new MessagesPlaceholder('history'),
      ['system', `Remember that you assist the user in a socratic style.`],
      ['human', '{input}'],
    ]);

    const { RunnableWithMessageHistory } = await dynamicImport(
      '@langchain/core/runnables',
    );
    const chain = new RunnableWithMessageHistory({
      runnable: prompt.pipe(chatModel).pipe(parser),
      getMessageHistory: () => chatHistory,
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
