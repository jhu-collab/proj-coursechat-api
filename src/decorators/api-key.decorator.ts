import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ApiKeyEntity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // Switching to HTTP context and getting the req object
    return request.apiKeyEntity;
  },
);
