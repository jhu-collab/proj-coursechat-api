import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsPositive,
  Min,
  IsString,
  Max,
} from 'class-validator';

export class FindChatsQueryDTO {
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

  @ApiPropertyOptional({ description: 'Search filter for chat titles' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by specific API key ID' })
  @IsInt()
  @IsOptional()
  apiKeyId?: number;

  @ApiPropertyOptional({ description: 'Filter by specific assistant name' })
  @IsString()
  @IsOptional()
  assistantName?: string;
}
