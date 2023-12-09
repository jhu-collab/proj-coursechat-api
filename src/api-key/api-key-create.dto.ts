import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { AppRoles } from './api-key.entity';

export class CreateApiKeyDTO {
  @ApiProperty({
    description: 'A description for the API key.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  @ApiProperty({
    description: 'The role associated with the API key.',
    enum: AppRoles,
    required: false,
  })
  @IsOptional()
  @IsEnum(AppRoles)
  role?: AppRoles;
}
