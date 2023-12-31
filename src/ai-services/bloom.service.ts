import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { MessageService } from 'src/message/message.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';

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

  public async generateResponse(
    input: string,
    chatId: number,
  ): Promise<string> {
    let context = '';
    if (chatId) {
      const messages = await this.messageService.findAll({ chatId });
      context = messages
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');
    }

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
