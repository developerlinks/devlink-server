import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
// import { getUserDto } from '../user/dto/get-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwt: JwtService) {}

  async signin(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new ForbiddenException('用户不存在，请注册');
    }

    // 用户密码进行比对
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或者密码错误');
    }

    return await this.jwt.signAsync({
      userId: user.id,
      email: user.email,
      username: user.username,
    });
  }

  async signup(user: CreateUserDto) {
    const { username, email, password } = user;
    const usertmp = await this.userService.findByEmail(email);

    if (usertmp) {
      throw new ForbiddenException('用户已存在');
    }

    const res = await this.userService.create({
      username,
      email,
      password,
    });

    return res;
  }
}

// import { Injectable } from '@nestjs/common';
// import { RedisService } from 'nestjs-redis';

// @Injectable()
// export class RedisAuthService {
//   constructor(private readonly redisService: RedisService) {}

//   async setVerificationCode(email: string, code: string) {
//     const client = await this.redisService.getClient();
//     await client.set(email, code, 'EX', 60 * 30); // 设置过期时间为 30 分钟
//   }

//   async getVerificationCode(email: string) {
//     const client = await this.redisService.getClient();
//     const code = await client.get(email);
//     await client.del(email); // 取出后删除
//     return code;
//   }
// }
