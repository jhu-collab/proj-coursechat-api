import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateAssistantDTO {
  @ApiPropertyOptional({ description: 'Updated description of the assistant' })
  @IsOptional()
  @IsString()
  description?: string;
}
