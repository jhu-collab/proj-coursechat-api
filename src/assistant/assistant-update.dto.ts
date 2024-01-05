import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating an assistant.
 *
 * This DTO defines the structure and validation rules for the data used to update an existing assistant.
 * It allows updating the description and the active status of the assistant.
 */
export class UpdateAssistantDTO {
  /**
   * Optional updated description for the assistant.
   * The description provides context or additional information about the assistant's role or characteristics.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsOptional - Indicates that this field is not required.
   * @IsString - Ensures the description is a string.
   */
  @ApiPropertyOptional({ description: 'A description for the assistant' })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Optional flag to update the active status of the assistant.
   * Indicates whether the assistant should be active (true) or inactive (false).
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsOptional - Indicates that this field is not required.
   * @IsBoolean - Validates that the input is a boolean.
   */
  @ApiPropertyOptional({ description: 'Indicates if the Assistant is active.' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
