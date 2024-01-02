import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { MessageRoles } from './message-roles.enum';
import { FindQueryDTO } from 'src/dto/find-query.dto';

export class FindMessagesQueryDTO extends FindQueryDTO {
  @ApiPropertyOptional({
    description: 'Filter by message role',
    enum: MessageRoles,
  })
  @IsEnum(MessageRoles)
  @IsOptional()
  role?: MessageRoles;

  @ApiPropertyOptional({ description: 'Filter by specific chat ID' })
  @IsUUID()
  @IsOptional()
  chatId?: string;
}
