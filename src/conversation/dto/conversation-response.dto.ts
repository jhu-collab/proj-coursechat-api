import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ConversationResponseDTO {
  @IsNumber()
  chatId: number;

  @IsNotEmpty()
  @IsString()
  response: string;
}
