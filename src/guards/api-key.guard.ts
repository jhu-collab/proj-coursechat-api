import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * A guard used in NestJS routes to ensure that the incoming request is accompanied by a valid and active API key.
 *
 * This guard checks for the presence and activity status of an API key associated with the request.
 * It is designed to be used in conjunction with routes that require API key authentication.
 *
 * The guard accesses the API key entity from the request, which should be attached by a preceding middleware or interceptor.
 * It then checks if this entity is both present and marked as active.
 *
 * If the API key entity is missing or inactive, the guard prevents further access by returning false.
 * If the API key entity is present and active, it allows the request to proceed by returning true.
 *
 * Usage:
 * This guard can be applied at the controller or route handler level using the `@UseGuards` decorator.
 *
 * @example
 * ```
 * @UseGuards(ApiKeyGuard)
 * @Get('/protected-route')
 * fetchData() {
 *   // Handle request
 * }
 * ```
 *
 * @implements {CanActivate}
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  /**
   * Method to determine whether the current request should be allowed to proceed.
   * It is automatically called by NestJS for routes where this guard is applied.
   *
   * @param {ExecutionContext} context - The execution context of the request in the NestJS application.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - A boolean or promise/observable that resolves to a boolean,
   * indicating whether the request is authorized to proceed. Returns true if the request has a valid, active API key; false otherwise.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.verbose('Checking API key validity...');

    const request = context.switchToHttp().getRequest();
    const apiKeyEntity = request.apiKeyEntity;

    if (!apiKeyEntity) {
      this.logger.warn('API key entity not found in the request');
      return false;
    }

    if (!apiKeyEntity.isActive) {
      this.logger.warn(`API key ${apiKeyEntity.id} is inactive`);
      return false;
    }

    this.logger.verbose(`API key ${apiKeyEntity.id} is valid and active`);
    return true;

    return true;
  }
}
