import { ApiProperty } from '@nestjs/swagger';
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

export class FindAssistantsQueryDTO {
  @ApiProperty({
    required: false,
    description: 'Limit the number of results',
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 50;

  @ApiProperty({
    required: false,
    description: 'Offset for pagination',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  offset: number = 0;

  @ApiProperty({
    required: false,
    description: 'Search filter for assistants',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Include soft-deleted assistants',
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    } else {
      return undefined;
    }
  })
  withDeleted?: boolean;

  @ApiProperty({
    required: false,
    description: 'Filter by active or inactive assistants',
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    } else {
      return undefined;
    }
  })
  isActive?: boolean;
}
