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

export class FindAssistantsQueryDTO {
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

  @ApiPropertyOptional({ description: 'Search filter for assistants' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Include soft-deleted assistants' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => booleanStringTransform(obj, 'withDeleted'))
  withDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by active or inactive assistants',
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => booleanStringTransform(obj, 'isActive'))
  isActive?: boolean;
}
