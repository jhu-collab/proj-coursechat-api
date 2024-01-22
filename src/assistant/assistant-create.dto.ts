import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, IsOptional } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a new assistant.
 *
 * This DTO defines the structure and validation rules for the data used to create a new assistant.
 * It includes fields for the assistant's name and an optional description.
 */
export class CreateAssistantDTO {
  /**
   * The name of the assistant. This is a required field.
   * The name is used to uniquely identify the assistant and must be between 1 and 50 characters.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role and constraints.
   * @IsString - Validates that the name is a string.
   * @Length(1, 50) - Ensures the name is between 1 and 50 characters long.
   */
  @ApiProperty({
    description: 'Name of the assistant',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  name: string;

  /**
   * Optional description of the assistant, providing additional context or information.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsOptional - Indicates that this field is not required.
   * @IsString - Ensures the description is a string.
   */
  @ApiPropertyOptional({
    description: 'Description of the assistant',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
