import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Gender } from '../profile.entity';

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

  @ApiProperty({ description: '性别', enum: Gender }) // 指定枚举类型
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

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
