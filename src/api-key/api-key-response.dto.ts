import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiKeyRoles } from './api-key-roles.enum';

export class ApiKeyResponseDTO {
  @ApiProperty({ description: 'The unique identifier of the API key.' })
  id: string;

  @ApiPropertyOptional({ description: 'A description for the API key.' })
  description?: string;

  @ApiProperty({ description: 'The creation date of the API key.' })
  createdAt: Date;

  @ApiProperty({ description: 'The last update date of the API key.' })
  updatedAt: Date;

  @ApiProperty({ description: 'Indicates if the API key is active.' })
  isActive: boolean;

  @ApiProperty({
    description: 'The role associated with the API key.',
    enum: ApiKeyRoles,
  })
  role: ApiKeyRoles;
}
