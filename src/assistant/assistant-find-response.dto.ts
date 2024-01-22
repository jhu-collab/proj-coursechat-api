import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssistantResponseDTO } from './assistant-response.dto';
import { FindResponseDTO } from 'src/dto/find-response.dto';

/**
 * Data Transfer Object (DTO) for the response of querying assistant data.
 *
 * This DTO extends FindResponseDTO to include specific data and filters used in assistant queries.
 * It represents the structure of the response sent back to the client when querying assistants,
 * including any applied filters such as `withDeleted` and `isActive`.
 */
export class FindAssistantsResponseDTO extends FindResponseDTO {
  /**
   * Optional flag indicating whether the response includes soft-deleted assistants.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({ description: 'Include soft-deleted assistants' })
  withDeleted?: boolean;

  /**
   * Optional flag indicating the filter applied on the active status of assistants.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({
    description: 'Filter by active or inactive assistants',
  })
  isActive?: boolean;

  /**
   * The actual data of the response, consisting of an array of assistant details.
   * Each element in the array is an instance of AssistantResponseDTO.
   *
   * @ApiProperty - Documents this property in Swagger, indicating the type and structure.
   */
  @ApiProperty({
    description: 'List of assistants',
    type: AssistantResponseDTO,
    isArray: true,
  })
  data: AssistantResponseDTO[];
}
