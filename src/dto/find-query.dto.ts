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

/**
 * Generic Data Transfer Object (DTO) for query parameters in find operations.
 *
 * This DTO is used to standardize and validate common query parameters like limit, offset, search, and sort order.
 * It can be extended or used as-is for various API endpoints that require these standard query features.
 */
export class FindQueryDTO {
  /**
   * Optional limit on the number of results to be returned.
   * It's a positive integer, typically used for pagination, with a maximum limit to control data load.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsInt - Validates that the input is an integer.
   * @IsPositive - Ensures the limit is a positive number.
   * @Min(1) - Sets the minimum allowed value to 1.
   * @Max(100) - Sets the maximum allowed value to 100.
   * @IsOptional - Indicates that this field is not required.
   */
  @ApiPropertyOptional({ description: 'Limit the number of results' })
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  /**
   * Optional offset for pagination.
   * Specifies the number of records to skip, often used in conjunction with 'limit' for paginated results.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsInt - Validates that the input is an integer.
   * @Min(0) - Ensures the offset is not negative.
   * @IsOptional - Indicates that this field is not required.
   */
  @ApiPropertyOptional({ description: 'Offset for pagination' })
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number;

  /**
   * Optional search filter.
   * A string used to filter results based on a search criteria, typically applied to textual fields.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsString - Validates that the input is a string.
   * @IsOptional - Indicates that this field is not required.
   */
  @ApiPropertyOptional({ description: 'Search filter' })
  @IsString()
  @IsOptional()
  search?: string;

  /**
   * Optional sort order of the results.
   * Specifies the order in which results should be returned, based on the predefined options in SortOrder enum.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @IsEnum(SortOrder) - Validates that the input matches one of the values in the SortOrder enum.
   * @IsOptional - Indicates that this field is not required.
   */
  @ApiPropertyOptional({
    description: 'Sort order of results',
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
