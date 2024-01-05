import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) for continuing an existing conversation.
 *
 * This DTO defines the structure and validation rules for the data required to send a follow-up message
 * in an ongoing conversation. It primarily consists of the content of the message to be sent.
 */
export class ContinueConversationDTO {
  /**
   * The content of the message to be sent in the conversation.
   * This is a required field and must be a non-empty string.
   * It represents the textual content of the user's message or query.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the conversation.
   * @IsNotEmpty - Ensures the message content is not an empty string.
   * @IsString - Validates that the message content is a string.
   */
  @ApiProperty({ description: 'Content of the message.' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
