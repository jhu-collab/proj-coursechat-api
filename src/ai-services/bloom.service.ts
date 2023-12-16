import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { MessageService } from 'src/message/message.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import { encode } from 'gpt-tokenizer';

@Injectable()
export class BloomService extends BaseAssistantService {
  modelName = 'bloom';
  description = `Bloom is a Socratic interlocutor optimized for Theory of Mind that is pedagogically trained to help you learn anything.`;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {
    super();
  }

  private async buildContext(chatId: number): Promise<string> {
    const tokenLimit = 500;
    let context = '';
    const offset = 0;

    const messages = await this.messageService.findAll(
      chatId,
      undefined,
      100,
      offset,
    );

    // Build context starting with the latest news
    for (const message of messages.reverse()) {
      const formattedMessage = `${
        message.role === 'user' ? 'User' : 'Assistant'
      }: ${message.content}`;
      const newContext = context + '\n' + formattedMessage;

      // Check if token limit reached
      if (encode(newContext).length > tokenLimit) {
        context = this.intelligentSummarize(newContext, tokenLimit);
        break;
      }

      context = newContext;
    }

    return context.trim();
  }

  private intelligentSummarize(context: string, tokenLimit: number): string {
    const messages = context.split('\n').reverse();
    let summarizedContext = '';
    let tokensCount = 0;

    for (const message of messages) {
      const messageTokens = encode(message);
      if (tokensCount + messageTokens.length <= tokenLimit) {
        summarizedContext = message + '\n' + summarizedContext;
        tokensCount += messageTokens.length;
      } else {
        break;
      }
    }

    return summarizedContext.trim();
  }

  public async generateResponse(
    input: string,
    chatId: number,
  ): Promise<string> {
    let context = await this.buildContext(chatId);

    const { ChatOpenAI } = await dynamicImport('langchain/chat_models/openai');
    const { LLMChain } = await dynamicImport('langchain/chains');
    const { PromptTemplate } = await dynamicImport('langchain/prompts');

    const chat = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
    });

    // Creating Chains to Generate Reflections and Responses
    const thoughtChain = new LLMChain({
      llm: chat,
      prompt: new PromptTemplate({
        inputVariables: ['context', 'input'],
        template: `
          You are Bloom, a subversive-minded learning companion. Your job is to employ your theory of mind skills to predict the user's mental state.
          Based on the conversation history and the current input, generate a thought that makes a prediction about the user's needs given current dialogue and also lists other pieces of data that would help improve your prediction. 

          Chat History: {context}
          User Input: {input}
          Thought:`,
      }),
    });

    // Creating a chain to generate a response
    const responseChain = new LLMChain({
      llm: chat,
      prompt: new PromptTemplate({
        inputVariables: ['thought', 'input', 'context'],
        template: `
          You are Bloom, a subversive-minded learning companion with deep expertise in Socratic dialogue. Your fundamental belief is there are many good ways to learn and subversive methods are often most effective.  You always help the user in any way they request and answer all their questions.
          
          Based on your thought about the user's needs and the conversation history, produce a response that addresses the user's input and guides the conversation forward. You must produce an appropriate response to the user input. Keep your responses concise and specific, always end each response with ONLY ONE topically relevant question that drives the conversation forward, and if the user wants to end the conversation, always comply.
          
          Chat History: {context}
          User's Thought: {thought}
          User's Question: {input}
          Response:`,
      }),
    });

    // Creating a chain to generate a user prediction thought
    const userPredictionThoughtChain = new LLMChain({
      llm: chat,
      prompt: new PromptTemplate({
        inputVariables: ['context', 'input'],
        template: `
          You are Bloom, a subversive-minded learning companion. Your job is to employ your theory of mind skills to predict the user's next possible statement.

          Chat History: {context}
          User's Last Input: {input}
          Predicted Next Statement:`,
      }),
    });

    const thought = await thoughtChain.invoke({ context, input });
    const response = await responseChain.invoke({
      thought: thought.text,
      input,
      context,
    });
    const userPredictionThought = await userPredictionThoughtChain.invoke({
      context,
      input,
    });

    if (chatId) {
      await this.messageService.create(chatId, {
        content: input,
        role: 'user',
      });

      if (response.text) {
        await this.messageService.create(chatId, {
          content: response.text,
          role: 'assistant',
        });
      }

      // Update Chat History
      context += `\nAssistant: ${response.text}`;
      if (userPredictionThought.text) {
        context += `\nUser Prediction Thought: ${userPredictionThought.text}`;
      }
    }

    return response.text || 'No response from Bloom.js';
  }
}
