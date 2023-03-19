import {
  Body,
  Controller,
  Post,
  // HttpException,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { EmailService } from '../tools/mail/mail.service';
import { ApiTags } from '@nestjs/swagger';
import { SignupUserDto } from './dto/signup-user.dto';

@ApiTags('用户验证')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private authService: AuthService, private readonly emailService: EmailService) {}

  @Post('/signin')
  async signin(@Body() dto: SigninUserDto) {
    const { email, password } = dto;
    const token = await this.authService.signin(email, password);
    return {
      access_token: token,
    };
  }

  @Post('/signup')
  signup(@Body() dto: SignupUserDto) {
    return this.authService.signup(dto);
  }

  @Post('send-code')
  async sendVerificationCode(@Body('email') email: string): Promise<void> {
    await this.emailService.sendVerificationCode(email);
  }
}
