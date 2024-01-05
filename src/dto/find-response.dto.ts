import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from './sort-order.enum';

/**
 * Generic Data Transfer Object (DTO) for responses to find operations.
 *
 * This DTO is used to standardize the structure of responses from API endpoints that involve querying data.
 * It includes details about the applied query parameters like limit, offset, search, and sort order.
 */
export class FindResponseDTO {
  /**
   * The limit on the number of results as applied in the query.
   * Indicates the maximum number of results returned in the response.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Limit the number of results' })
  limit?: number;

  /**
   * The offset applied in the query for pagination.
   * Specifies the starting point of the results returned in the response.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'Offset for pagination' })
  offset?: number;

  /**
   * The search filter applied in the query, if any.
   * Indicates the text-based criteria used to filter the results.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   */
  @ApiPropertyOptional({ description: 'Search filter' })
  search?: string;

  /**
   * The sort order applied to the results.
   * Specifies how the results are ordered, based on the predefined options in SortOrder enum.
   *
   * @ApiPropertyOptional - Marks this property as optional in Swagger documentation.
   * @ApiProperty - Indicates the enum used for defining the sort order.
   */
  @ApiPropertyOptional({
    description: 'Sort order of results',
    enum: SortOrder,
  })
  sortOrder?: SortOrder;
}
