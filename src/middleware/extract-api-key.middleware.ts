import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiKeyService } from 'src/api-key/api-key.service';
import { ApiKey } from 'src/api-key/api-key.entity';

// Extend Request interface locally
interface RequestWithApiKeyEntity extends Request {
  apiKeyEntity?: ApiKey;
}

@Injectable()
export class ExtractApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async use(req: RequestWithApiKeyEntity, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
      try {
        // Fetch the API key entity from the database
        const apiKeyEntity = await this.apiKeyService.findByKey(
          apiKey as string,
        );
        // Attach the entire API key entity to the request
        req.apiKeyEntity = apiKeyEntity;
      } catch (error) {
        // If the API key is not found or any other error occurs, throw an UnauthorizedException
        throw new UnauthorizedException('Invalid API key');
      }
    } else {
      throw new UnauthorizedException('API key is required');
    }
    next();
  }
}
