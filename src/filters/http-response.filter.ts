import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response, Request } from 'express';

/**
 * A global exception filter that formats and handles HTTP exceptions and other types of exceptions.
 *
 * This filter catches exceptions thrown from within the application and formats them into a standardized JSON structure.
 * It handles both NestJS's HttpException (which includes standard HTTP exceptions like BadRequestException)
 * and generic exceptions, ensuring a consistent response structure for all errors.
 *
 * @Catch() - Indicates that this filter is meant to catch exceptions.
 */
@Catch()
export class HttpResponseFilter {
  private readonly logger = new Logger(HttpResponseFilter.name);

  /**
   * Method to handle caught exceptions and format the response.
   *
   * @param {unknown} exception - The caught exception.
   * @param {ArgumentsHost} host - Contextual information about the host (HTTP-specific in this case).
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    this.logger.error(`Exception caught: ${exception}`);

    let errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        this.logger.verbose(
          'Exception response is a string, setting as message',
        );
        errorResponse['message'] = exceptionResponse;
      } else {
        this.logger.verbose(
          'Exception response is an object, merging with errorResponse',
        );
        errorResponse = { ...errorResponse, ...exceptionResponse };
      }
    } else {
      errorResponse['message'] = 'Internal Server Error';
      if (process.env.NODE_ENV === 'development') {
        errorResponse['error'] = exception.toString();
      }
    }

    this.logger.error(exception);

    response.status(status).json(errorResponse);
  }
}
