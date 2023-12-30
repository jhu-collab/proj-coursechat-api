import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssistantResponseDTO {
  @ApiProperty({ description: 'Name of the assistant' })
  name: string;

  @ApiPropertyOptional({ description: 'Description of the assistant' })
  description?: string;

  @ApiProperty({ description: 'Creation date of the assistant' })
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date of the assistant' })
  updatedAt: Date;

  @ApiProperty({ description: 'Whether the assistant is active or not' })
  isActive: boolean;
}
