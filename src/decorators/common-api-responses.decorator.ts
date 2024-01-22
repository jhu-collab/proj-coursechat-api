import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDTO } from 'src/dto/error-response.dto';

/**
 * Custom decorator that applies common API response annotations for Swagger documentation.
 *
 * This decorator adds standardized response information for common HTTP status codes,
 * such as 400, 401, 404, and 500. It utilizes the `ErrorResponseDTO` to describe the shape
 * of the error response for these statuses. It's a convenient way to ensure consistent
 * documentation across different parts of the application.
 *
 * Usage:
 * Apply this decorator to controller methods to automatically document common error responses.
 *
 * @example
 * ```
 * @Get('/some-endpoint')
 * @CommonApiResponses()
 * someMethod() {
 *   // Controller logic...
 * }
 * ```
 */
export function CommonApiResponses() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request',
      type: ErrorResponseDTO,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      type: ErrorResponseDTO,
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found',
      type: ErrorResponseDTO,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: ErrorResponseDTO,
    }),
  );
}
