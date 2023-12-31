import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DefaultPaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.query.limit === undefined) {
      request.query.limit = 50; // Default limit
    }

    if (request.query.offset === undefined) {
      request.query.offset = 0; // Default offset
    }

    return next.handle().pipe(map((data) => data));
  }
}
