import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsBoolean } from 'class-validator';

export class UpdateApiKeyDTO {
  @ApiPropertyOptional({ description: 'A description for the API key.' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  @ApiPropertyOptional({ description: 'Indicates if the API key is active.' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
