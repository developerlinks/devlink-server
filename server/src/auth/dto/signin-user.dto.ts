import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninUserDto {
  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  @ApiProperty()
  password: string;
}
