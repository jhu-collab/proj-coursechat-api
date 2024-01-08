import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for the response containing details of a chat session.
 *
 * This DTO defines the structure of the data representing a chat in responses.
 * It includes the chat's unique identifier, title, creation and update dates, and identifiers for the associated API key and assistant.
 */
export class ChatResponseDTO {
  /**
   * The unique identifier of the chat session.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'ID of the chat' })
  id: string;

  /**
   * The title of the chat session.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Title of the chat' })
  title: string;

  /**
   * The date and time when the chat was created.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Creation date of the chat' })
  createdAt: Date;

  /**
   * The date and time when the chat was last updated.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Last updated date of the chat' })
  updatedAt: Date;

  /**
   * The unique identifier of the API key associated with the chat.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'ID of the associated API key' })
  apiKeyId: string;

  /**
   * The name of the assistant associated with the chat.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Name of the associated assistant' })
  assistantName: string;
}
