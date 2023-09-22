import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateMessageDTO {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(['system', 'user', 'assistant', 'function'])
  role: string;
}
