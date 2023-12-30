import { ApiProperty } from '@nestjs/swagger';
import { AssistantResponseDTO } from './assistant-response.dto';

export class FindAssistantsResponseDTO {
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
    description: 'Search filter for assistants',
  })
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Include soft-deleted assistants',
  })
  withDeleted?: boolean;

  @ApiProperty({
    required: false,
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
