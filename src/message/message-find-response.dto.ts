import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageResponseDTO } from './message-response.dto';
import { MessageRoles } from './message.entity';

export class FindMessagesResponseDTO {
  @ApiProperty({ description: 'Limit the number of results' })
  limit?: number;

  @ApiProperty({ description: 'Offset for pagination' })
  offset?: number;

  @ApiPropertyOptional({ description: 'Search filter for messages' })
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by specific chat ID' })
  chatId?: string;

  @ApiPropertyOptional({ description: 'Filter by message role' })
  role?: MessageRoles;

  @ApiProperty({
    description: 'List of messages',
    type: MessageResponseDTO,
    isArray: true,
  })
  data: MessageResponseDTO[];
}
