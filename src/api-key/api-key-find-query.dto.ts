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

export class FindApiKeysQueryDTO {
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
    description: 'Search filter for API keys',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Include soft-deleted API keys',
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => {
    if ('withDeleted' in obj && obj.withDeleted === 'true') {
      return true;
    } else if ('withDeleted' in obj && obj.withDeleted === 'false') {
      return false;
    } else {
      return undefined;
    }
  })
  withDeleted?: boolean;

  @ApiProperty({
    required: false,
    description: 'Filter by active or inactive API keys',
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => {
    if ('isActive' in obj && obj.isActive === 'true') {
      return true;
    } else if ('isActive' in obj && obj.isActive === 'false') {
      return false;
    } else {
      return undefined;
    }
  })
  isActive?: boolean;
}
