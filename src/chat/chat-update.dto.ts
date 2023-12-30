import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

export class UpdateChatDTO {
  @ApiPropertyOptional({
    description: 'Updated title of the chat',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  title?: string;
}
