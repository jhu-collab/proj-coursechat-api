import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDTO {
  @ApiProperty({ description: 'ID of the message' })
  id: string;

  @ApiProperty({ description: 'Content of the message' })
  content: string;

  @ApiProperty({ description: 'Role of the message' })
  role: string;

  @ApiProperty({ description: 'Creation date of the message' })
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date of the message' })
  updatedAt: Date;

  @ApiProperty({ description: 'ID of the associated chat' })
  chatId: string;
}
