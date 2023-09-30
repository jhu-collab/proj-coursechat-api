import { IsString, Length, IsOptional } from 'class-validator';

export class CreateAssistantDTO {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
