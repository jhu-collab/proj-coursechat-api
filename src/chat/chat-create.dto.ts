import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

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
}
