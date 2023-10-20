import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDTO {
  @ApiProperty({ description: 'The HTTP status code of the error response.' })
  statusCode: number;

  @ApiProperty({ description: 'The timestamp when the error occurred.' })
  timestamp: string;

  @ApiProperty({
    description: 'The path of the request that caused the error.',
  })
  path: string;

  @ApiProperty({ description: 'The error message.' })
  message: string;

  @ApiProperty({
    description: 'Additional error details, if any.',
    required: false,
  })
  error?: any;
}
