import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating a chat session.
 *
 * This DTO defines the structure and validation rules for the data used to update an existing chat.
 * It currently allows updating the title of the chat.
 */
export class UpdateChatDTO {
  /**
   * Optional updated title for the chat session.
   * The title provides a brief description or identifier for the chat.
   * This field is optional and, if provided, must be a non-empty string up to 500 characters in length.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsOptional - Indicates that this field is not required.
   * @IsString - Validates that the title is a string.
   * @IsNotEmpty - Ensures the title is not an empty string.
   * @Length(1, 500) - Ensures the title is between 1 and 500 characters long.
   */
  @ApiPropertyOptional({
    description: 'Updated title of the chat',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  title?: string;
}
