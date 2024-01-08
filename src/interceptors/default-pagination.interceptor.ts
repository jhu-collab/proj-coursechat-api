import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SortOrder } from 'src/dto/sort-order.enum';

/**
 * An interceptor that applies default pagination settings to the incoming requests.
 *
 * This interceptor checks the request for pagination parameters (limit, offset) and sorting order.
 * If these parameters are not provided, it sets them to default values.
 *
 * @implements {NestInterceptor}
 */
@Injectable()
export class DefaultPaginationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DefaultPaginationInterceptor.name);

  /**
   * Method to intercept and apply default pagination settings.
   *
   * @param {ExecutionContext} context - The execution context of the request in the NestJS application.
   * @param {CallHandler} next - The next processor in the NestJS request processing pipeline.
   * @returns {Observable<any>} - An observable that resolves to the processed request.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.verbose('Applying default pagination settings to the request');

    const request = context.switchToHttp().getRequest();

    // Apply default limit and offset if not provided
    if (request.query.limit === undefined) {
      this.logger.verbose('Setting default limit to 50');
      request.query.limit = 50;
    }

    if (request.query.offset === undefined) {
      this.logger.verbose('Setting default offset to 0');
      request.query.offset = 0;
    }

    // Apply default sorting order if not provided
    if (request.query.sortOrder === undefined) {
      this.logger.verbose('Setting default sorting order to descending');
      request.query.sortOrder = SortOrder.DESC;
    }

    return next.handle().pipe(map((data) => data));
  }
}
