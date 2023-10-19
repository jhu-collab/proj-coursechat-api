import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { MessageRoles } from '../message.entity';

export class CreateMessageDTO {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(MessageRoles)
  role: string;
}
