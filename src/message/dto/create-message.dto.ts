import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { MessageRoles } from '../message.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDTO {
  @ApiProperty({ description: 'Content of the message' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Role of the message', enum: MessageRoles })
  @IsNotEmpty()
  @IsEnum(MessageRoles)
  role: string;
}
