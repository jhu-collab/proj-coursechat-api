import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsPositive,
  Min,
  IsString,
  Max,
  IsEnum,
} from 'class-validator';
import { MessageRoles } from './message.entity';

export class FindMessagesQueryDTO {
  @ApiPropertyOptional({ description: 'Limit the number of results' })
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ description: 'Offset for pagination' })
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional({ description: 'Search filter for message content' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by message role',
    enum: MessageRoles,
  })
  @IsEnum(MessageRoles)
  @IsOptional()
  role?: MessageRoles;

  @ApiPropertyOptional({ description: 'Filter by specific chat ID' })
  @IsInt()
  @IsOptional()
  chatId?: number;
}
