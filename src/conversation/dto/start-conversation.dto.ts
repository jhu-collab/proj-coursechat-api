import { IsString, IsNotEmpty, Length } from 'class-validator';

export class StartConversationDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  assistantName: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
