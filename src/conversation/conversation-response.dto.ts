import { ApiProperty } from '@nestjs/swagger';

export class ConversationResponseDTO {
  @ApiProperty({ description: 'Unique ID of the chat.' })
  chatId: string;

  @ApiProperty({ description: 'Response message.' })
  response: string;
}
