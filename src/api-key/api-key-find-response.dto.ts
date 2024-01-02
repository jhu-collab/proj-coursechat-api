import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiKeyResponseDTO } from './api-key-response.dto';
import { FindResponseDTO } from 'src/dto/find-response.dto';

export class FindApiKeysResponseDTO extends FindResponseDTO {
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
