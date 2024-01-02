import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssistantResponseDTO } from './assistant-response.dto';
import { FindResponseDTO } from 'src/dto/find-response.dto';

export class FindAssistantsResponseDTO extends FindResponseDTO {
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
