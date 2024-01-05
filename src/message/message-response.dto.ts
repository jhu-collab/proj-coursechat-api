import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for the response containing details of a message.
 *
 * This DTO defines the structure of the data representing a message in responses.
 * It includes the message's unique identifier, content, role, creation and update dates, and the identifier of the associated chat.
 */
export class MessageResponseDTO {
  /**
   * The unique identifier of the message.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'ID of the message' })
  id: string;

  /**
   * The text content of the message.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Content of the message' })
  content: string;

  /**
   * The role of the message, indicating its source or purpose.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Role of the message' })
  role: string;

  /**
   * The date and time when the message was created.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Creation date of the message' })
  createdAt: Date;

  /**
   * The date and time when the message was last updated.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Last updated date of the message' })
  updatedAt: Date;

  /**
   * The unique identifier of the chat to which this message belongs.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'ID of the associated chat' })
  chatId: string;
}
