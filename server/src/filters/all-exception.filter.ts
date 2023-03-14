import {
  ExceptionFilter,
  HttpAdapterHost,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { ArgumentsHost, Catch } from '@nestjs/common';

import * as requestIp from 'request-ip';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const msg: unknown = exception['response'] || 'Internal Server Error';
    const responseBody = {
      // headers: request.headers,
      // query: request.query,
      status: httpStatus,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      // ip: requestIp.getClientIp(request),
      exceptioin: exception['name'],
      message: msg,
    };

    this.logger.error('[devLink]', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
