import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';
import { FindQueryDTO } from 'src/dto/find-query.dto';
import { booleanStringTransform } from 'src/utils/transform.utils';

export class FindAssistantsQueryDTO extends FindQueryDTO {
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
