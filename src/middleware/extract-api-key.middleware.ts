import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from 'src/api-key/api-key.service';
import { ApiKey } from 'src/api-key/api-key.entity';

// Extend Request interface locally
interface RequestWithApiKeyEntity extends Request {
  apiKeyEntity?: ApiKey;
}

/**
 * Middleware for extracting an API key from the request headers.
 *
 * This middleware is responsible for examining incoming requests to the server
 * and extracting an API key if it is provided in the 'x-api-key' header of the request.
 *
 * If an API key is provided, the corresponding API key entity from the database
 * is attached to the request object for further use down the request processing pipeline.
 *
 * Usage:
 * This middleware should be configured in the NestJS module setup to be applied to the routes
 * that require API key authentication.
 *
 * @example
 * ```
 * app.useGlobalMiddleware(ExtractApiKeyMiddleware);
 * ```
 *
 * @implements {NestMiddleware}
 */
@Injectable()
export class ExtractApiKeyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ExtractApiKeyMiddleware.name);

  /**
   * Constructor.
   *
   * @constructor
   * @param {ApiKeyService} apiKeyService - Injected API key service.
   */
  constructor(private readonly apiKeyService: ApiKeyService) {}

  /**
   * The method executed when the middleware is applied to a route.
   * It checks for the presence of an 'x-api-key' header. If the header is present,
   * it attempts to fetch the corresponding API key entity from the database and attaches it to the request object.
   * If the API key is not found in the database, a warning is logged.
   * If the 'x-api-key' header is not present, it logs this fact and proceeds without action.
   *
   * @param {RequestWithApiKeyEntity} req - The incoming request object, extended to include the API key entity.
   * @param {Response} res - The outgoing response object.
   * @param {NextFunction} next - The next function in the request processing pipeline.
   */
  async use(req: RequestWithApiKeyEntity, res: Response, next: NextFunction) {
    this.logger.verbose('Extracting API key...');

    const apiKey = req.headers['x-api-key'];

    if (apiKey) {
      this.logger.verbose(
        'API key found in request headers, fetching entity from database',
      );
      const apiKeyEntity = await this.apiKeyService.findOne(apiKey as string);
      if (!apiKeyEntity) {
        this.logger.warn(`API key ${apiKey} not found in the database`);
      }
      req.apiKeyEntity = apiKeyEntity;
    } else {
      this.logger.log('No API key found in request headers');
    }

    next();
  }
}
