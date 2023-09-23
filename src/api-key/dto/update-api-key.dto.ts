import { IsString, IsOptional, Length, IsBoolean } from 'class-validator';

export class UpdateApiKeyDTO {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
