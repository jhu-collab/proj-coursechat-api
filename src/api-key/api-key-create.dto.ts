import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { AppRoles } from './api-key.entity';

export class CreateApiKeyDTO {
  @ApiPropertyOptional({
    description: 'A description for the API key.',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  @ApiPropertyOptional({
    description: 'The role associated with the API key.',
    enum: AppRoles,
  })
  @IsOptional()
  @IsEnum(AppRoles)
  role?: AppRoles;
}
