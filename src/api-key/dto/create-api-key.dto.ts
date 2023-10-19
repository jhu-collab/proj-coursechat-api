import { IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { AppRoles } from '../api-key.entity';

export class CreateApiKeyDTO {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  @IsOptional()
  @IsEnum(AppRoles)
  role?: AppRoles;
}
