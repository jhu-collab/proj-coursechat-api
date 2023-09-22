import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateChatPartialDTO {
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @IsNotEmpty()
  title?: string;
}
