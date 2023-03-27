import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
// import { getUserDto } from '../user/dto/get-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from 'src/modules/user/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
  ) {}

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

    const token = await this.jwt.signAsync({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const refreshToken = this.jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      { expiresIn: '180 days' },
    );

    user.profile.refresh_token = refreshToken;
    user.profile.refresh_token_expires_at = Number(
      new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    );

    await this.userRepository.save(user);

    return {
      token,
      refreshToken,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwt.verify(refreshToken);

      const profile = await this.profileRepository.findOne({
        where: { refresh_token: refreshToken },
      });

      if (!profile || profile.refresh_token_expires_at < Number(new Date())) {
        throw new UnauthorizedException('Invalid or expired refresh token.');
      }

      return this.generateTokens(profile.user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwt.sign({ userId: user.id });
    const refreshToken = this.jwt.sign({ userId: user.id }, { expiresIn: '180 days' });

    const profile = await this.profileRepository.findOne({
      where: {
        id: user.profile.id,
      },
    });
    profile.refresh_token = refreshToken;
    profile.refresh_token_expires_at = Number(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000));
    await this.profileRepository.save(profile);

    return { accessToken, refreshToken };
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
