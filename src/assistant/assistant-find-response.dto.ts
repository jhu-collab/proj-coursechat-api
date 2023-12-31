import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssistantResponseDTO } from './assistant-response.dto';

export class FindAssistantsResponseDTO {
  @ApiProperty({ description: 'Limit the number of results' })
  limit?: number;

  @ApiProperty({ description: 'Offset for pagination' })
  offset?: number;

  @ApiPropertyOptional({ description: 'Search filter for assistants' })
  search?: string;

  @ApiPropertyOptional({ description: 'Include soft-deleted assistants' })
  withDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by active or inactive assistants',
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'List of assistants',
    type: AssistantResponseDTO,
    isArray: true,
  })
  data: AssistantResponseDTO[];
}
