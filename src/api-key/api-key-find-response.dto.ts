import { ApiProperty } from '@nestjs/swagger';
import { ApiKeyResponseDTO } from './api-key-response.dto';

export class FindApiKeysResponseDTO {
  @ApiProperty({
    required: false,
    description: 'Limit the number of results',
  })
  limit: number;

  @ApiProperty({
    required: false,
    description: 'Offset for pagination',
  })
  offset: number;

  @ApiProperty({
    required: false,
    description: 'Search filter for API keys',
  })
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Include soft-deleted API keys',
  })
  withDeleted?: boolean;

  @ApiProperty({
    required: false,
    description: 'Filter by active or inactive API keys',
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'List of API keys',
    type: ApiKeyResponseDTO,
    isArray: true,
  })
  data: ApiKeyResponseDTO[];
}
