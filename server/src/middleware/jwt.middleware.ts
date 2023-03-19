import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ConfigEnum } from 'src/enum/config.enum';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const payload = await verify(token, this.configService.get(ConfigEnum.SECRET));
      req.user = payload;
    }
    next();
  }
}
