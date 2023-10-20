import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDTO } from 'src/dto/api-response.dto';

type WrappedResponseOptions = {
  description?: string;
  status?: number;
  type?: any;
  isArray?: boolean;
};

export const ApiOkResponseWithWrapper = (options: WrappedResponseOptions) => {
  const { type, isArray, ...responseOptions } = options;

  // Basic schema definition without the `data` property
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

  // Only pass the type to ApiExtraModels if it exists
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
