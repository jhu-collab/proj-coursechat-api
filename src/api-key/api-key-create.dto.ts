import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { ApiKeyRoles } from './api-key-roles.enum';

/**
 * Data Transfer Object (DTO) for creating an API key.
 *
 * This DTO defines the structure and validation rules for the data used to create a new API key.
 * It includes optional fields for a description and a role associated with the API key.
 */
export class CreateApiKeyDTO {
  /**
   * Optional description for the API key.
   * The description provides context or additional information about the API key's purpose.
   *
   * @IsOptional - Indicates that this field is not required.
   * @IsString - Ensures the description is a string.
   * @Length(1, 255) - Ensures the description is between 1 and 255 characters long.
   */
  @ApiPropertyOptional({
    description: 'A description for the API key.',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  /**
   * Optional role associated with the API key.
   * The role determines the level of access or permissions granted by the API key.
   *
   * @IsOptional - Indicates that this field is not required.
   * @IsEnum(ApiKeyRoles) - Ensures the role is one of the predefined roles in ApiKeyRoles.
   */
  @ApiPropertyOptional({
    description: 'The role associated with the API key.',
    enum: ApiKeyRoles,
  })
  @IsOptional()
  @IsEnum(ApiKeyRoles)
  role?: ApiKeyRoles;
}
