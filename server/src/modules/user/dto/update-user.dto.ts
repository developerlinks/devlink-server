import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: '邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: '密码' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: '性别' })
  @IsOptional()
  @IsString()
  gender?: number;

  @ApiProperty({ description: '照片' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ description: '地址' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: '个人描述' })
  @IsOptional()
  @IsString()
  description?: string;
}
