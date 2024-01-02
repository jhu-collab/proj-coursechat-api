import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatResponseDTO } from './chat-response.dto';
import { FindResponseDTO } from 'src/dto/find-response.dto';

export class FindChatsResponseDTO extends FindResponseDTO {
  @ApiPropertyOptional({ description: 'Filter by specific API key ID' })
  apiKeyId?: string;

  @ApiPropertyOptional({ description: 'Filter by specific assistant name' })
  assistantName?: string;

  @ApiProperty({
    description: 'List of chats',
    type: ChatResponseDTO,
    isArray: true,
  })
  data: ChatResponseDTO[];
}
