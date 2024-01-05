import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

/**
 * Data Transfer Object (DTO) for starting a new conversation.
 *
 * This DTO defines the structure and validation rules for the initial data required to start a conversation,
 * including the conversation's title, the assistant's name, and the initial message.
 */
export class StartConversationDTO {
  /**
   * The title of the conversation.
   * This is a required field and must be a non-empty string, up to 500 characters in length.
   * It serves as a brief identifier or subject of the conversation.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role and constraints.
   * @IsString - Validates that the title is a string.
   * @IsNotEmpty - Ensures the title is not an empty string.
   * @Length(1, 500) - Ensures the title is between 1 and 500 characters long.
   */
  @ApiProperty({ description: 'Title of the conversation.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  title: string;

  /**
   * The name of the assistant involved in the conversation.
   * This is a required field and must be a non-empty string, up to 50 characters in length.
   * It identifies the assistant entity that will be participating in the conversation.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role and constraints.
   * @IsString - Validates that the assistant name is a string.
   * @IsNotEmpty - Ensures the assistant name is not an empty string.
   * @Length(1, 50) - Ensures the assistant name is between 1 and 50 characters long.
   */
  @ApiProperty({ description: 'Name of the assistant.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  assistantName: string;

  /**
   * The initial message to start the conversation.
   * This is a required field and must be a non-empty string.
   * It represents the first message or query from the user to kick off the conversation.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the conversation.
   * @IsNotEmpty - Ensures the message is not an empty string.
   * @IsString - Validates that the message is a string.
   */
  @ApiProperty({ description: 'Initial message to start the conversation.' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
