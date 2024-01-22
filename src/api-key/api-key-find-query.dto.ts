import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';
import { FindQueryDTO } from 'src/dto/find-query.dto';
import { booleanStringTransform } from 'src/utils/transform.utils';

/**
 * Data Transfer Object (DTO) for querying API keys with additional filter options.
 *
 * This DTO extends the basic FindQueryDTO to include specific filters relevant to searching API keys,
 * such as filtering by active status and including soft-deleted entries.
 */
export class FindApiKeysQueryDTO extends FindQueryDTO {
  /**
   * Optional flag to include soft-deleted API keys in the search results.
   * When set to true, the query will return API keys that have been soft-deleted.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsBoolean - Validates that the input is a boolean.
   * @IsOptional - Indicates that this field is not required.
   * @Transform - Custom transform function to convert string input to boolean.
   */
  @ApiPropertyOptional({ description: 'Include soft-deleted API keys' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => booleanStringTransform(obj, 'withDeleted'))
  withDeleted?: boolean;

  /**
   * Optional flag to filter the API keys by their active status.
   * When set to true, only active API keys are returned. When set to false, only inactive keys are returned.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsBoolean - Validates that the input is a boolean.
   * @IsOptional - Indicates that this field is not required.
   * @Transform - Custom transform function to convert string input to boolean.
   */
  @ApiPropertyOptional({ description: 'Filter by active or inactive API keys' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ obj }) => booleanStringTransform(obj, 'isActive'))
  isActive?: boolean;
}
