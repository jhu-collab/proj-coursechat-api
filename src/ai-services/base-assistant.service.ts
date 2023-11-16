export abstract class BaseAssistantService {
  abstract readonly modelName: string;
  abstract readonly description: string;
  // Define other shared properties and methods here

  // Modified Method
  public async generateResponse(
    input: string,
    contextMessages: string[], // *New historical context parameter
    chatId?: number,
  ): Promise<string> {
    const combinedInput = contextMessages.concat(input).join('\n');
    return `Response from ${this.modelName} for chatId ${chatId}: ${combinedInput}`; // *Modified response
  }
}
