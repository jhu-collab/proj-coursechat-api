/**
 * Enumeration representing the roles of messages in a chat, mirroring roles used in OpenAI's API chat completions.
 *
 * This enum defines roles that categorize messages based on their source and purpose in a conversation.
 * It includes roles for system messages, user inputs, AI responses, and function call results.
 */
export enum MessageRoles {
  /**
   * Represents messages that are system-generated.
   * Typically includes automated messages, instructions, or other content not part of the user-AI exchange.
   */
  SYSTEM = 'system',

  /**
   * Represents messages inputted by the human user in the conversation.
   * These are the prompts or questions to which the AI (assistant) responds.
   */
  USER = 'user',

  /**
   * Represents messages generated by the AI, like ChatGPT.
   * This includes responses, answers, or any conversational contributions made by the AI.
   */
  ASSISTANT = 'assistant',

  /**
   * Represents the result of a function call within the chat.
   * Function roles are used for messages that are outcomes of specific functionalities or commands executed by the AI.
   * For more details on function calling in OpenAI's platform, see: https://platform.openai.com/docs/guides/function-calling
   */
  FUNCTION = 'function',
}
