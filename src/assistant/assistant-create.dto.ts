import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, IsOptional } from 'class-validator';

export class CreateAssistantDTO {
  @ApiProperty({
    description: 'Name of the assistant',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the assistant',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
