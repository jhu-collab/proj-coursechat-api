import { IsString, IsOptional } from 'class-validator';

export class UpdateAssistantDTO {
  @IsOptional()
  @IsString()
  description?: string;
}
