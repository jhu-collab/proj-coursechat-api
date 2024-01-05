import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for the response containing details of an assistant.
 *
 * This DTO defines the structure of the data representing an assistant in responses.
 * It includes the assistant's name, an optional description, creation and update dates, and their active status.
 */
export class AssistantResponseDTO {
  /**
   * The name of the assistant. This is a unique identifier for the assistant.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Name of the assistant' })
  name: string;

  /**
   * Optional description of the assistant, providing additional context or information.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({ description: 'Description of the assistant' })
  description?: string;

  /**
   * The date and time when the assistant record was created.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Creation date of the assistant' })
  createdAt: Date;

  /**
   * The date and time when the assistant record was last updated.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Last updated date of the assistant' })
  updatedAt: Date;

  /**
   * Indicates whether the assistant is currently active.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Whether the assistant is active or not' })
  isActive: boolean;
}
