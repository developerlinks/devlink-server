import { Global, Logger, LoggerService, Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { connectionParams } from '../ormconfig';
import { LogsModule } from './modules/logsM/logs.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { MaterialModule } from './modules/materials/material.module';
import { ConfigEnum } from './enum/config.enum';
import { PolisherModule } from './tools/textPolisher/text-polisher.module';
import { GroupModule } from './modules/group/group.module';

const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;
const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  DB_PORT: Joi.number().default(3306),
  DB_HOST: Joi.alternatives().try(Joi.string().ip(), Joi.string().domain()),
  DB_TYPE: Joi.string().valid('mysql'),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(false),
  LOG_ON: Joi.boolean(),
  LOG_LEVEL: Joi.string(),
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [
        () => {
          const values = dotenv.config({ path: '.env' });
          const { error } = schema.validate(values?.parsed, {
            // 允许未知的环境变量
            allowUnknown: true,
            // 如果有错误，不要立即停止，而是收集所有错误
            abortEarly: false,
          });
          if (error) {
            throw new Error(
              `Validation failed - Is there an environment variable missing?
        ${error.message}`,
            );
          }
          return values;
        },
      ],
      validationSchema: schema,
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService, logger: LoggerService) => {
        const host = configService.get(ConfigEnum.REDIS_HOST);
        const port = configService.get(ConfigEnum.REDIS_PORT);
        const password = configService.get(ConfigEnum.REDIS_PASSWORD);
        // ${password}@
        const url = password ? `redis://${host}:${port}` : `redis://${host}:${port}`;
        return {
          config: {
            url,
            reconnectOnError: err => {
              logger.error(`Redis Connection error: ${err}`, url);
              return true;
            },
          },
        };
      },
      inject: [ConfigService, Logger],
    }),
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    LogsModule,
    RolesModule,
    AuthModule,
    GroupModule,
    MaterialModule,
    PolisherModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
