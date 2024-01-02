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
import { SortOrder } from './sort-order.enum';

export class FindQueryDTO {
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

  @ApiPropertyOptional({ description: 'Search filter' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort order of results',
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
