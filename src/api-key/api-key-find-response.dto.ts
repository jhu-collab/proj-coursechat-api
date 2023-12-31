import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiKeyResponseDTO } from './api-key-response.dto';

export class FindApiKeysResponseDTO {
  @ApiProperty({ description: 'Limit the number of results' })
  limit?: number;

  @ApiProperty({ description: 'Offset for pagination' })
  offset?: number;

  @ApiPropertyOptional({ description: 'Search filter for API keys' })
  search?: string;

  @ApiPropertyOptional({ description: 'Include soft-deleted API keys' })
  withDeleted?: boolean;

  @ApiPropertyOptional({ description: 'Filter by active or inactive API keys' })
  isActive?: boolean;

  @ApiProperty({
    description: 'List of API keys',
    type: ApiKeyResponseDTO,
    isArray: true,
  })
  data: ApiKeyResponseDTO[];
}
