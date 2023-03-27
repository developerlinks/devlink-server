import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../enum/config.enum';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private configService: ConfigService, @InjectRedis() private readonly redis: Redis) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // custom logic can go here
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    // const cacheToken = this.redis.get(token);
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await verify(token, this.configService.get(ConfigEnum.SECRET));
    const { email } = payload;
    const tokenCache = email ? await this.redis.get(email) : null;
    if (!payload || !email || tokenCache !== token) {
      throw new UnauthorizedException();
    }

    const parentCanActivate = (await super.canActivate(context)) as boolean;
    return parentCanActivate;
  }
}

// 装饰器
// @JwtGuard()
