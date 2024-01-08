import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * An interceptor that formats the HTTP responses of the application.
 *
 * This interceptor standardizes the structure of responses sent back to the client.
 * It ensures that all responses, regardless of their original format, conform to a consistent structure.
 * This includes wrapping the actual response data and adding standard fields like 'statusCode' and 'message'.
 *
 * @implements {NestInterceptor}
 */
@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpResponseInterceptor.name);

  /**
   * Method to intercept and transform the response of a request.
   *
   * @param {ExecutionContext} context - The execution context of the request in the NestJS application.
   * @param {CallHandler} next - The next processor in the NestJS request processing pipeline.
   * @returns {Observable<any>} - An observable that resolves to the transformed response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.verbose('Intercepting HTTP response to standardize its format');

    return next.handle().pipe(
      map((response) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        this.logger.verbose(
          `Formatting response with status code: ${statusCode}`,
        );

        if (typeof response === 'object' && 'data' in response) {
          this.logger.verbose(
            'Response contains "data" field; wrapping with standard format',
          );
          return {
            statusCode: statusCode,
            message: 'Success',
            ...response,
          };
        }

        this.logger.verbose(
          'Response does not contain "data" field; adding "data" field in standard format',
        );
        return {
          statusCode: statusCode,
          message: 'Success',
          data: response,
        };
      }),
    );
  }
}
