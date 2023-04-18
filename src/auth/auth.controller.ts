import {
  Body,
  Controller,
  Post,
  // HttpException,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Req,
} from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

import { TypeormFilter } from 'src/filters/typeorm.filter';
import { AuthService } from './auth.service';
import { SignInByEmailAndPassowrdDto, SignInByEmailAndCodeDto } from './dto/signin-user.dto';
import { EmailService } from '../tools/mail/mail.service';
import { ApiOperation, ApiOkResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { SignupUserDto } from './dto/signup-user.dto';
import { SendCodeDto } from 'src/tools/mail/dto/send-code.dto';

@ApiTags('用户验证')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly emailService: EmailService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @ApiOperation({ summary: '邮箱&密码 登录' })
  @Post('/signin_by_password')
  async signInByEmailAndPassword(@Body() dto: SignInByEmailAndPassowrdDto) {
    const { email, password } = dto;

    const { user, token, refreshToken } = await this.authService.signInByEmailAndPassword(
      email,
      password,
    );
    // 设置token
    await this.redis.set(`${email}_token`, token, 'EX', 24 * 60 * 60);
    return {
      user,
      access_token: token,
      refreshToken,
    };
  }

  @ApiOperation({ summary: '邮箱&验证码 登录' })
  @Post('/signin_by_code')
  async signInByEmailAndcode(@Body() dto: SignInByEmailAndCodeDto) {
    const { email, code } = dto;
    const { token, refreshToken } = await this.authService.signInByEmailAndCode(email, code);
    // 设置token
    await this.redis.set(`${email}_token`, token, 'EX', 24 * 60 * 60);
    return {
      access_token: token,
      refreshToken,
    };
  }

  @ApiOperation({ summary: '刷新 Token' })
  @Post('refresh-token')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshAccessToken(refreshToken);
  }

  // 退出登录
  @ApiOperation({ summary: '退出登录' })
  @Get('/logout')
  async logout(@Req() req) {
    const { email } = req.user;
    return await this.redis.del(`${email}_token`);
  }

  @ApiOperation({ summary: '注册' })
  @Post('/signup')
  signup(@Body() dto: SignupUserDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: '发送验证码' })
  @ApiBody({ description: '邮箱', type: SendCodeDto })
  @ApiOkResponse({ description: '验证码', type: String })
  @Post('send-code')
  async sendVerificationCode(@Body('email') email: string): Promise<void> {
    await this.emailService.sendVerificationCode(email);
  }
}
