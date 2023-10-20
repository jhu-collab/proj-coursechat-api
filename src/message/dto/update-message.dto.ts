import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMessageDTO {
  @ApiProperty({ description: 'Updated content of the message' })
  @IsNotEmpty()
  @IsString()
  content?: string;
}
