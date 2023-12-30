import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateAssistantDTO {
  @ApiPropertyOptional({ description: 'A description for the assistant' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Indicates if the Assistant is active.' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
