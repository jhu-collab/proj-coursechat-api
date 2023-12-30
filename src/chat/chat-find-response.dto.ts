import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatResponseDTO } from './chat-response.dto';

export class FindChatsResponseDTO {
  @ApiProperty({ description: 'Limit the number of results' })
  limit: number;

  @ApiProperty({ description: 'Offset for pagination' })
  offset: number;

  @ApiPropertyOptional({ description: 'Search filter for chats' })
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by specific API key ID' })
  apiKeyId?: number;

  @ApiPropertyOptional({ description: 'Filter by specific assistant name' })
  assistantName?: string;

  @ApiProperty({
    description: 'List of chats',
    type: ChatResponseDTO,
    isArray: true,
  })
  data: ChatResponseDTO[];
}
