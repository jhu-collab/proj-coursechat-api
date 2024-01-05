import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for responses within a conversation.
 *
 * This DTO is used to return data about the conversation, including the chat's unique identifier
 * and the response message from the system or assistant.
 */
export class ConversationResponseDTO {
  /**
   * The unique identifier of the chat session.
   * This ID is used to reference the specific conversation within the system.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in identifying the chat.
   */
  @ApiProperty({ description: 'Unique ID of the chat.' })
  chatId: string;

  /**
   * The response message in the conversation.
   * This message could be from the system, an assistant, or generated in response to user input.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the conversation.
   */
  @ApiProperty({ description: 'Response message.' })
  response: string;
}
