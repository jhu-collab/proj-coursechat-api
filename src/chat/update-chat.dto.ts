import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateChatDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
}
