import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateMessageDTO {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(['system', 'user', 'assistant', 'function'])
  role: string;
}
