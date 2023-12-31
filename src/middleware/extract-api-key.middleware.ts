import {
  Injectable,
  Logger,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from 'src/api-key/api-key.service';
import { ApiKey } from 'src/api-key/api-key.entity';

const logger = new Logger('ExtractApiKeyMiddleware');

// Extend Request interface locally
interface RequestWithApiKeyEntity extends Request {
  apiKeyEntity?: ApiKey;
}

@Injectable()
export class ExtractApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async use(req: RequestWithApiKeyEntity, res: Response, next: NextFunction) {
    logger.verbose('Extracting API key...');
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
      logger.verbose('API key found in request headers');
      try {
        logger.verbose('Fetch the API key entity from the database');
        const apiKeyEntity = await this.apiKeyService.findOne(apiKey as string);
        if (!apiKeyEntity) {
          throw new NotFoundException(`API Key ${apiKey} not found`);
        }
        logger.verbose('Attach the entire API key entity to the request');
        req.apiKeyEntity = apiKeyEntity;
      } catch (error) {
        // If the API key is not found or any other error occurs, throw an UnauthorizedException
        logger.error(error);
        throw new UnauthorizedException('Invalid API key');
      }
    } else {
      throw new UnauthorizedException('API key is required');
    }
    next();
  }
}
