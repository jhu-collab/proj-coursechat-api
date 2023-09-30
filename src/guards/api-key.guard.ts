import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiKeyService } from 'src/api-key/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeyService: ApiKeyService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.apiKey;

    if (!apiKey) {
      return false;
    }

    return this.apiKeyService.validateApiKey(apiKey);
  }
}
