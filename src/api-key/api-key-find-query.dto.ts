import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  Min,
  IsString,
  Max,
  IsBoolean,
} from 'class-validator';
import { booleanStringTransform } from 'src/utils/transform.utils';

export class FindApiKeysQueryDTO {
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

  @ApiPropertyOptional({ description: 'Search filter for API keys' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Include soft-deleted API keys' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => booleanStringTransform(obj, 'withDeleted'))
  withDeleted?: boolean;

  @ApiPropertyOptional({ description: 'Filter by active or inactive API keys' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => booleanStringTransform(obj, 'isActive'))
  isActive?: boolean;
}
