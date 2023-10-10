import { IsString, IsNotEmpty } from 'class-validator';

export class ContinueConversationDTO {
  @IsNotEmpty()
  @IsString()
  message: string;
}
