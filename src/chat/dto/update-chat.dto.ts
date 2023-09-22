import { IsString, IsNotEmpty, Length } from 'class-validator';

export class UpdateChatDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  title: string;
}
