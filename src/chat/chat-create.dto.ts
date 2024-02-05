import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a new chat session.
 *
 * This DTO defines the structure and validation rules for the data used to create a new chat.
 * It includes fields for the chat's title and the name of the assistant assigned to the chat.
 */
export class CreateChatDTO {
  /**
   * The title of the chat session.
   * This is a required field and must be a non-empty string, up to 500 characters in length.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role and constraints.
   * @IsString - Validates that the title is a string.
   * @IsNotEmpty - Ensures the title is not an empty string.
   * @Length(1, 500) - Ensures the title is between 1 and 500 characters long.
   */
  @ApiProperty({ description: 'Title of the chat', maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  title: string;

  /**
   * The name of the assistant assigned to the chat.
   * This is a required field and must be a non-empty string, up to 50 characters in length.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role and constraints.
   * @IsString - Validates that the assistant name is a string.
   * @IsNotEmpty - Ensures the assistant name is not an empty string.
   * @Length(1, 50) - Ensures the assistant name is between 1 and 50 characters long.
   */
  @ApiProperty({ description: 'Name of the assistant', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  assistantName: string;

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
   * Additional metadata for the chat.
   * This field can store any additional information that needs to be associated with the chat.
   * It is allowed to be null.
   *
   * @ApiPropertyOptional - Documents this property in Swagger as optional, indicating its role and constraints.
   * @IsOptional - Indicates that the metadata is not a required field.
   */
  @ApiPropertyOptional({
    description: 'Additional metadata for the chat',
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
