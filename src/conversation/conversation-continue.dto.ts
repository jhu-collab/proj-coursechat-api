import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ContinueConversationDTO {
  @ApiProperty({ description: 'Content of the message.' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
