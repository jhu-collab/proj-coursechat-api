import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator that extracts the 'apiKeyEntity' from the request object.
 *
 * This decorator can be used in route handlers to directly access the 'apiKeyEntity'
 * that is attached to the request object, typically by a middleware or interceptor.
 * It simplifies the process of accessing the API key entity associated with the request.
 *
 * Usage:
 * Apply the decorator to a route handler parameter to inject the 'apiKeyEntity' into the handler.
 *
 * @example
 * ```
 * @Get('/some-route')
 * handleRoute(@ApiKeyEntity() apiKeyEntity: ApiKey) {
 *   // Use apiKeyEntity here
 * }
 * ```
 *
 * @param {unknown} data - Additional data that can be passed to the decorator (not used in this case).
 * @param {ExecutionContext} ctx - The execution context of the request in the NestJS application.
 * @returns {ApiKey | undefined} - The API key entity attached to the request, or undefined if not present.
 */
export const ApiKeyEntity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.apiKeyEntity;
  },
);
