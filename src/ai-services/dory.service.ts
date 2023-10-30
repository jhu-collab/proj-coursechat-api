import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './base-assistant.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';

@Injectable()
export class DoryService extends BaseAssistantService {
  modelName = 'dory';
  description = `Dory is an AI assistant named after a fictional blue tang 
character from the American animated film series Finding Nemo. 
Dory, the animated character, suffers from short-term memory loss, 
which often frustrates Marlin, especially when his son Nemo is in danger. 
The AI assistant, Dory, is a stateless agent, meaning that it treats each 
incoming query independently, just like the underlying LLMs and chat models. 
Dory does not retain any memory of previous interactions.`;

  constructor(private readonly configService: ConfigService) {
    super();
  }

  public async generateResponse(input: string): Promise<string> {
    const { ChatOpenAI } = await dynamicImport('langchain/chat_models/openai');
    const { HumanMessage } = await dynamicImport('langchain/schema');

    const chat = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
    });

    const response = await chat.call([new HumanMessage(input)]);

    return response?.content || 'No response from Dory.js';
  }
}
