import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for updating the content of a message.
 *
 * This DTO defines the structure and validation rules for the data used to update the content of an existing message.
 * It includes an optional field for the updated message content.
 */
export class UpdateMessageDTO {
  /**
   * Optional updated content for the message.
   * This field, if provided, must be a non-empty string and represents the new text content of the message.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   * @IsNotEmpty - Ensures the content is not an empty string.
   * @IsString - Validates that the content is a string.
   */
  @ApiProperty({ description: 'Updated content of the message' })
  @IsNotEmpty()
  @IsString()
  content?: string;
}
