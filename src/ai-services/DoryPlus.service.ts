import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { dynamicImport } from 'src/utils/dynamic-import.utils';
import { ConversationService } from 'src/conversation/conversation.service';
import { BaseAssistantService } from './base-assistant.service';

@Injectable()
export class DoryPlus extends BaseAssistantService {
  modelName = 'DoryPlus';
  description = `DoryPlus is an advanced AI assistant inspired by the beloved character Dory, a fictional blue tang from the popular animated film series "Finding Nemo". Unlike the original Dory character who is known for her short-term memory loss, DoryPlus is engineered with the capability to remember and reference past conversations. This enhancement allows DoryPlus to provide contextually relevant responses and recall previous interactions, a feature that is particularly useful for ongoing dialogues and complex queries.

As an AI assistant, DoryPlus combines the charming and friendly characteristics of its namesake with advanced memory functions. Whether you're asking about the first question in your conversation, seeking follow-up information, or referencing earlier discussions, DoryPlus is designed to maintain a coherent and continuous interaction history. This stateful approach sets DoryPlus apart from typical AI models and other assistants in the Dory series, offering users a more personalized and engaging conversational experience.\`;
`;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
  ) {
    super();
  }

  public async generateResponse(
    input: string,
    PassedID?: number,
  ): Promise<string> {
    const { ChatOpenAI } = await dynamicImport('langchain/chat_models/openai');
    const { RunnableSequence } = await dynamicImport(
      'langchain/dist/schema/runnable/base.js',
    );
    const { LLMChain } = await dynamicImport('langchain/chains');
    const { PromptTemplate } = await dynamicImport('langchain/dist/prompts');
    const { SystemMessage, HumanMessage } =
        await dynamicImport('langchain/schema');

    const questionAnsweringModel = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
    });

    const DoryPlusTemplate = new PromptTemplate({
      inputVariables: ['question', 'ChatHistory'],
      template: `You are DoryPlus, a virtual assistant designed to provide information and guidance for queries.
I am equipped to handle a wide range of inquiries.
My goal is to provide concise, accurate, and helpful responses to your questions.
Please consider the following conversation history when expecting my response:
Chat History:
{ChatHistory}
If the Chat History is empty, then do not account for it.
Question: {question}
Final Answer (formatted in Markdown):\``,
    });

    const answerGeneratorChain = new LLMChain({
      llm: questionAnsweringModel,
      prompt: DoryPlusTemplate,
    });

    const performQuestionAnswering = async (input: {
      question: string;
      chatID: number;
    }): Promise<{ result: string }> => {
      //need to serialize chatHistory Message[] as it will only represent some Object here without should occur maybe in conversation service
      let ChatHistory = '';
      let ChatHistoryObjects =
        await this.conversationService.getAllMessagesInConversation(
          input.chatID,
        );

      for (let i = 0; i < ChatHistoryObjects.length; i++) {
        const message = ChatHistoryObjects[i];
        if (message.role === 'user') {
          ChatHistory += new HumanMessage(message.content);
        } else if (message.role === 'assistant') {
          ChatHistory += new SystemMessage(message.content);
        }
      }

      //Reformatted question being passed in
      const response = await answerGeneratorChain.invoke({
        ChatHistory: ChatHistory,
        question: input.question,
      });

      return response.text;
    };

    const runChain = RunnableSequence.from([
      {
        // Pipe the question through unchanged
        question: (input: { question: string }) => input.question,
        //Can grab full chat history here in future iteration but chat serialization should be in conversation service
        chatID: (input: { chatID: number }) => input.chatID,
      },
      performQuestionAnswering,
    ]);
    return (
      (await runChain.invoke({ question: input, chatID: PassedID })) ||
      'No response from Dory.js'
    );
  }
}
