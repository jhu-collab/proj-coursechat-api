import { IsString } from 'class-validator';

export class UpdateChatPartialDTO {
  @IsString()
  title?: string;
}
