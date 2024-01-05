import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';
import { FindQueryDTO } from 'src/dto/find-query.dto';
import { booleanStringTransform } from 'src/utils/transform.utils';

/**
 * Data Transfer Object (DTO) for querying assistant data with additional filter options.
 *
 * This DTO extends the basic FindQueryDTO to include specific filters relevant to searching for assistants,
 * such as filtering by active status and including soft-deleted entries.
 */
export class FindAssistantsQueryDTO extends FindQueryDTO {
  /**
   * Optional flag to include soft-deleted assistants in the search results.
   * When set to true, the query will return assistants that have been soft-deleted.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsBoolean - Validates that the input is a boolean.
   * @IsOptional - Indicates that this field is not required.
   * @Transform - Custom transform function to convert string input to boolean.
   */
  @ApiPropertyOptional({ description: 'Include soft-deleted assistants' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => booleanStringTransform(obj, 'withDeleted'))
  withDeleted?: boolean;

  /**
   * Optional flag to filter the assistants by their active status.
   * When set to true, only active assistants are returned. When set to false, only inactive assistants are returned.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsBoolean - Validates that the input is a boolean.
   * @IsOptional - Indicates that this field is not required.
   * @Transform - Custom transform function to convert string input to boolean.
   */
  @ApiPropertyOptional({
    description: 'Filter by active or inactive assistants',
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => booleanStringTransform(obj, 'isActive'))
  isActive?: boolean;
}
