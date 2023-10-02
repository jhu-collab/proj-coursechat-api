export abstract class BaseAssistantService {
  protected abstract modelName: string;

  // Define other shared properties and methods here

  // Shared Method Example
  public async generateResponse(input: string): Promise<string> {
    // Implement a shared way to generate responses here, can be overridden by extending classes
    return `Response from ${this.modelName}: ${input}`;
  }
}
