import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDTO<T> {
  @ApiProperty({ description: 'HTTP status code of the response.' })
  statusCode: number;

  @ApiProperty({
    description: 'Message describing the nature of the response.',
  })
  message: string;

  data: T;
}
