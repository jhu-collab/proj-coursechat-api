import { ApiProperty } from '@nestjs/swagger';

export class ConversationResponseDTO {
  @ApiProperty({ description: 'Unique ID of the chat.' })
  chatId: number;

  @ApiProperty({ description: 'Response message.' })
  response: string;
}
