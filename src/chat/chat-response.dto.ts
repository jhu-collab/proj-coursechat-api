import { ApiProperty } from '@nestjs/swagger';

export class ChatResponseDTO {
  @ApiProperty({ description: 'ID of the chat' })
  id: number;

  @ApiProperty({ description: 'Title of the chat' })
  title: string;

  @ApiProperty({ description: 'Creation date of the chat' })
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date of the chat' })
  updatedAt: Date;

  @ApiProperty({ description: 'ID of the associated API key' })
  apiKeyId: string;

  @ApiProperty({ description: 'Name of the associated assistant' })
  assistantName: string;
}
