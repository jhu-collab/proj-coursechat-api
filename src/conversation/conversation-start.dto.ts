import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class StartConversationDTO {
  @ApiProperty({ description: 'Title of the conversation.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  title: string;

  @ApiProperty({ description: 'Name of the assistant.' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  assistantName: string;

  @ApiProperty({ description: 'Initial message to start the conversation.' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
