import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAssistantService } from './assistant-00-base.service';
import { dynamicImport } from 'src/utils/dynamic-import.utils';

/**
 * Service for the "Dory" AI assistant.
 *
 * DoryService is an AI assistant service inspired by the character Dory from the animated film series Finding Nemo.
 * Dory, the character, is known for her short-term memory loss, and similarly, this AI assistant operates as a stateless agent.
 * It treats each incoming query independently, without retaining any memory of previous interactions.
 *
 * @Injectable - Marks the class as a provider that can be injected into other classes.
 */
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

  /**
   * Constructor for DoryService.
   *
   * Initializes the service and injects the ConfigService for configuration management.
   *
   * @param {ConfigService} configService - The configuration service for accessing environment variables.
   */
  constructor(private readonly configService: ConfigService) {
    super();
    this.logger.log('DoryService initialized');
  }

  /**
   * Generates a response based on the provided input.
   *
   * This method utilizes the LangChain ChatOpenAI model to process the input and generate a response.
   * The method dynamically imports necessary components and initializes the ChatOpenAI with specific configurations.
   *
   * @param {string} input - The input message to be processed by Dory.
   * @returns {Promise<string>} - The AI-generated response.
   */
  public async generateResponse(input: string): Promise<string> {
    this.logger.verbose(`Generating response for input: ${input}`);
    const { ChatOpenAI } = await dynamicImport('langchain/chat_models/openai');
    const { HumanMessage } = await dynamicImport('langchain/schema');

    const chat = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      streaming: false,
    });

    let response = await chat.call([new HumanMessage(input)]);
    response = response?.content || 'No response from Dory.js';

    this.logger.verbose(`Dory response: ${response}`);

    return response;
  }
}
