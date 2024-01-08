import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiKeyResponseDTO } from './api-key-response.dto';
import { FindResponseDTO } from 'src/dto/find-response.dto';

/**
 * Data Transfer Object (DTO) for the response of querying API keys.
 *
 * This DTO extends FindResponseDTO to include specific data and filters used in API key queries.
 * It represents the structure of the response sent back to the client when querying API keys,
 * including any applied filters such as `withDeleted` and `isActive`.
 */
export class FindApiKeysResponseDTO extends FindResponseDTO {
  /**
   * Optional flag indicating whether the response includes soft-deleted API keys.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({ description: 'Include soft-deleted API keys' })
  withDeleted?: boolean;

  /**
   * Optional flag indicating the filter applied on the active status of API keys.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({ description: 'Filter by active or inactive API keys' })
  isActive?: boolean;

  /**
   * The actual data of the response, consisting of an array of API key details.
   * Each element in the array is an instance of ApiKeyResponseDTO.
   *
   * @ApiProperty - Documents this property in Swagger, indicating the type and structure.
   */
  @ApiProperty({
    description: 'List of API keys',
    type: ApiKeyResponseDTO,
    isArray: true,
  })
  data: ApiKeyResponseDTO[];
}
