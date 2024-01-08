export abstract class BaseAssistantService {
  abstract readonly modelName: string;
  abstract readonly description: string;

  public async generateResponse(
    input: string,
    chatId?: string,
  ): Promise<string> {
    let response = `Response from ${this.modelName}: ${input}`;
    if (chatId !== undefined) {
      response += ` for chatId ${chatId}`;
    }
    return response;
  }
}
