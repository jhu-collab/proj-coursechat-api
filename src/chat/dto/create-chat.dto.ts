import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateChatDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  readonly title: string;
}
