import { ApiProperty } from '@nestjs/swagger';
import { AppRoles } from './api-key.entity';

export class ApiKeyResponseDTO {
  @ApiProperty({ description: 'The unique identifier of the API key.' })
  id: number;

  @ApiProperty({ description: 'The value of the API key.' })
  apiKeyValue: string;

  @ApiProperty({
    description: 'A description for the API key.',
    required: false,
  })
  description?: string;

  @ApiProperty({ description: 'The creation date of the API key.' })
  createdAt: Date;

  @ApiProperty({ description: 'The last update date of the API key.' })
  updatedAt: Date;

  @ApiProperty({ description: 'Indicates if the API key is active.' })
  isActive: boolean;

  @ApiProperty({
    description: 'The role associated with the API key.',
    enum: AppRoles,
  })
  role: AppRoles;
}
