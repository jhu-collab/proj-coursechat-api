import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsBoolean,
  IsOptional,
} from 'class-validator';

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
   * A flag indicating whether the response should be streamed.
   * When set to true, the response from the assistant will be streamed back to the client.
   * Defaults to true, enabling streaming behavior.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role and default behavior.
   * @IsBoolean - Validates that the input is a boolean value.
   * @Transform - Custom transform function to convert string input to boolean.
   */
  @ApiProperty({
    description: 'Flag to stream the response.',
    default: true,
  })
  @IsBoolean()
  stream: boolean = true;

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

  /**
   * An optional username associated with the chat.
   * This field can be used by external applications to link chats to specific users.
   * It can store up to 255 characters and is allowed to be null.
   *
   * @ApiPropertyOptional - Documents this property in Swagger as optional, indicating its role and constraints.
   * @IsString - Validates that the username, if provided, is a string.
   * @IsOptional - Indicates that the username is not a required field.
   * @Length(1, 255) - Ensures the username, if provided, is between 1 and 255 characters long.
   */
  @ApiPropertyOptional({
    description: 'Username associated with the chat',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  username?: string;

  /**
   * The metadata associated with the chat.
   * This field, if provided during chat creation, includes additional information about the chat.
   * It is included in the response to provide context about the chat's contents or purpose.
   *
   * @ApiPropertyOptional - Documents this property in Swagger as optional, indicating its role and presence in the response.
   */
  @ApiPropertyOptional({ description: 'Additional metadata for the chat' })
  @IsOptional()
  metadata?: Record<string, any>;
}
