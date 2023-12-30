import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDTO } from 'src/dto/error-response.dto';

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
