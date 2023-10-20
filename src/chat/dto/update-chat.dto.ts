import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class UpdateChatDTO {
  @ApiProperty({ description: 'Updated title of the chat', maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  title: string;
}
