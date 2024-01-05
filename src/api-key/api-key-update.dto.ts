import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsBoolean } from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating an API key.
 *
 * This DTO defines the structure and validation rules for the data used to update an existing API key.
 * It allows updating the description and the active status of the API key.
 */
export class UpdateApiKeyDTO {
  /**
   * Optional updated description for the API key.
   * The description provides context or additional information about the API key's purpose.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsOptional - Indicates that this field is not required.
   * @IsString - Ensures the description is a string.
   * @Length(1, 255) - Ensures the description is between 1 and 255 characters long.
   */
  @ApiPropertyOptional({ description: 'A description for the API key.' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  /**
   * Optional flag to update the active status of the API key.
   * Indicates whether the API key should be active (true) or inactive (false).
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsOptional - Indicates that this field is not required.
   * @IsBoolean - Validates that the input is a boolean.
   */
  @ApiPropertyOptional({ description: 'Indicates if the API key is active.' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
