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
  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    this.logger.error(exception.message, exception.stack);
    const msg: unknown = exception['response'] || '网络错误';
    const responseBody = {
      timestamp: new Date().toISOString(),
      // headers: request.headers,
      // query: request.query,
      // ip: requestIp.getClientIp(request),
      body: request.body,
      params: request.params,
      status: httpStatus,
      exceptioin: exception['name'],
      message: msg,
    };

    this.logger.error('[devLink]', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
