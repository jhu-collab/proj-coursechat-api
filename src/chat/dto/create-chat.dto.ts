import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateChatDTO {
  @ApiProperty({ description: 'Title of the chat', maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  title: string;

  @ApiProperty({ description: 'Name of the assistant', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  assistantName: string;
}
