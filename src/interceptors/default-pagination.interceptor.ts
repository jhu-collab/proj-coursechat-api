import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SortOrder } from 'src/dto/sort-order.enum';

@Injectable()
export class DefaultPaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Set default limit and offset
    request.query.limit = request.query.limit ?? 50;
    request.query.offset = request.query.offset ?? 0;

    // Set default sorting order to descending
    request.query.sortOrder = request.query.sortOrder ?? SortOrder.DESC;

    return next.handle().pipe(map((data) => data));
  }
}
