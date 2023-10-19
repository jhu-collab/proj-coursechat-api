import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKeyEntity = request.apiKeyEntity;

    // Check if apiKeyEntity exists and is active
    if (!apiKeyEntity || !apiKeyEntity.isActive) {
      return false;
    }

    return true;
  }
}
