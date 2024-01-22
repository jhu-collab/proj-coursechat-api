import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for error responses.
 *
 * This DTO defines the structure of the data sent back to the client when an error occurs.
 * It includes details such as the status code, timestamp, request path, error message, and any additional error information.
 */
export class ErrorResponseDTO {
  /**
   * The HTTP status code associated with the error response.
   * It reflects the nature of the error (e.g., 404 for not found, 500 for internal server error).
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'The HTTP status code of the error response.' })
  statusCode: number;

  /**
   * The timestamp indicating when the error occurred.
   * It helps in tracking and logging the exact time of the error.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'The timestamp when the error occurred.' })
  timestamp: string;

  /**
   * The path of the request that led to the error.
   * Useful for identifying the API endpoint or route where the error occurred.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({
    description: 'The path of the request that caused the error.',
  })
  path: string;

  /**
   * A descriptive error message.
   * This message provides a clear explanation of what caused the error.
   *
   * @ApiProperty - Documents this property in Swagger, indicating its role in the response.
   */
  @ApiProperty({ description: 'The error message.' })
  message: string;

  /**
   * Additional details about the error, if available.
   * This field can contain any information relevant to the error (e.g., stack trace, nested errors).
   *
   * @ApiProperty - Documents this property in Swagger, indicating its optional nature.
   */
  @ApiProperty({
    description: 'Additional error details, if any.',
    required: false,
  })
  error?: any;
}
