import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiKeyRoles } from './api-key-roles.enum';

/**
 * Data Transfer Object (DTO) for the response containing API key details.
 *
 * This DTO defines the structure of the data returned when API keys are queried.
 * It includes essential information about an API key such as its identifier, description,
 * creation and update dates, active status, and associated role.
 */
export class ApiKeyResponseDTO {
  /**
   * The unique identifier of the API key.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'The unique identifier of the API key.' })
  id: string;

  /**
   * Optional description of the API key, providing additional context or information.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({ description: 'A description for the API key.' })
  description?: string;

  /**
   * The date and time when the API key was created.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'The creation date of the API key.' })
  createdAt: Date;

  /**
   * The date and time when the API key was last updated.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'The last update date of the API key.' })
  updatedAt: Date;

  /**
   * Indicates whether the API key is currently active.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Indicates if the API key is active.' })
  isActive: boolean;

  /**
   * The role associated with the API key, determining the level of access or permissions.
   *
   * @ApiProperty - Documents this property in Swagger, indicating the available roles.
   */
  @ApiProperty({
    description: 'The role associated with the API key.',
    enum: ApiKeyRoles,
  })
  role: ApiKeyRoles;
}
