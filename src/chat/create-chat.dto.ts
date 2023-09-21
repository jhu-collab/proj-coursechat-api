import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChatDTO {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
}
