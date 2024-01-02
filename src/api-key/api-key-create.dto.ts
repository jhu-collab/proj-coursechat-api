import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { ApiKeyRoles } from './api-key-roles.enum';

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
    enum: ApiKeyRoles,
  })
  @IsOptional()
  @IsEnum(ApiKeyRoles)
  role?: ApiKeyRoles;
}
