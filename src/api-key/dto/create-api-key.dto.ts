import { IsString, Length, IsOptional } from 'class-validator';

export class CreateApiKeyDTO {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;
}
