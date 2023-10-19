import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMessageDTO {
  @IsNotEmpty()
  @IsString()
  content?: string;
}
