import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getServerConfig } from '../ormconfig';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';

export const setupApp = (app: INestApplication) => {
  const config = getServerConfig();

  const flag: boolean = config['LOG_ON'] === 'true';
  flag && app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const httpAdapter = app.get(HttpAdapterHost);
  // // 全局Filter只能有一个
  const logger = new Logger();
  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段
      whitelist: true,
    }),
  );

  // helmet头部安全
  app.use(helmet());

  // rateLimit限流
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 300, // limit each IP to 100 requests per windowMs
    }),
  );
};
