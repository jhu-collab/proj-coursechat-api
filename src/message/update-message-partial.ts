import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMessagePartialDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(['system', 'user', 'assistant', 'function'])
  role?: string;
}
