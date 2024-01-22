import { ApiProperty } from '@nestjs/swagger';

/**
 * Generic Data Transfer Object (DTO) for API responses.
 *
 * This DTO is used as a wrapper for standardizing the structure of responses sent from the API.
 * It includes a status code, a descriptive message, and a data field that can hold any type of content.
 *
 * @template T - The type of data contained in the response.
 */
export class ApiResponseDTO<T> {
  /**
   * The HTTP status code of the response.
   * Indicates the result of the request (e.g., success, error, etc.).
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'HTTP status code of the response.' })
  statusCode: number;

  /**
   * A message describing the nature of the response.
   * Provides additional information about the result of the request.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({
    description: 'Message describing the nature of the response.',
  })
  message: string;

  /**
   * The actual data payload of the response.
   * The type of this data can vary and is defined by the generic type parameter T.
   */
  data: T;
}
