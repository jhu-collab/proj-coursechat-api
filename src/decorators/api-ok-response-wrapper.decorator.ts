import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDTO } from 'src/dto/api-response.dto';

/**
 * Options for the wrapped API response.
 */
type WrappedResponseOptions = {
  description?: string;
  status?: number;
  type?: any;
  isArray?: boolean;
};

/**
 * Custom decorator that extends the standard Swagger ApiOkResponse decorator.
 * It wraps the response in a standardized response structure defined by ApiResponseDTO.
 * This structure typically includes fields like 'statusCode', 'message', and 'data'.
 *
 * Usage:
 * Apply this decorator to controller methods where you want to document the response format
 * using the ApiResponseDTO wrapper.
 *
 * @example
 * ```
 * @Get('/items')
 * @ApiOkResponseWithWrapper({
 *   description: 'A list of items',
 *   type: ItemDTO,
 *   isArray: true
 * })
 * getItems() {
 *   // Method implementation...
 * }
 * ```
 *
 * @param {WrappedResponseOptions} options - The options for the response, including type, array flag, and others.
 * @returns {DecoratorFunction} - A custom decorator function for Swagger documentation.
 */
export const ApiOkResponseWithWrapper = (options: WrappedResponseOptions) => {
  const { type, isArray, ...responseOptions } = options;

  // Schema definition without the `data` property
  const schemaDefinition: any = {
    allOf: [{ $ref: getSchemaPath(ApiResponseDTO) }],
  };

  // If a type is provided, extend the schema definition to include the `data` property
  if (type) {
    schemaDefinition.allOf.push({
      properties: {
        data: isArray
          ? {
              type: 'array',
              items: { $ref: getSchemaPath(type) },
            }
          : { $ref: getSchemaPath(type) },
      },
    });
  }

  // Apply decorators based on the provided type
  const decorators = type
    ? [
        ApiExtraModels(ApiResponseDTO, type),
        ApiOkResponse({ ...responseOptions, schema: schemaDefinition }),
      ]
    : [
        ApiExtraModels(ApiResponseDTO),
        ApiOkResponse({ ...responseOptions, schema: schemaDefinition }),
      ];

  return applyDecorators(...decorators);
};
