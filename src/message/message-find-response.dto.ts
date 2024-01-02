import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageResponseDTO } from './message-response.dto';
import { MessageRoles } from './message-roles.enum';
import { FindResponseDTO } from 'src/dto/find-response.dto';

export class FindMessagesResponseDTO extends FindResponseDTO {
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
