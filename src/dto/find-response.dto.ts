import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from './sort-order.enum';

export class FindResponseDTO {
  @ApiProperty({ description: 'Limit the number of results' })
  limit?: number;

  @ApiProperty({ description: 'Offset for pagination' })
  offset?: number;

  @ApiPropertyOptional({ description: 'Search filter' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort order of results',
    enum: SortOrder,
  })
  sortOrder?: SortOrder;
}
