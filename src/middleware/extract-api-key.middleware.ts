import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Extend Request interface locally
interface RequestWithApiKey extends Request {
  apiKey?: string;
}

@Injectable()
export class ExtractApiKeyMiddleware implements NestMiddleware {
  async use(req: RequestWithApiKey, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
      req.apiKey = apiKey as string;
    }

    next();
  }
}
