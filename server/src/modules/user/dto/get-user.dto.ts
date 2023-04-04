import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RolesEnum } from 'src/modules/roles/roles.entity';
import { Gender } from '../profile.entity';

export class getUserDto {
  @ApiProperty({ description: '页数' })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ description: '每页的数量' })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({ description: '用户名' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: '邮箱' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: '角色', enum: RolesEnum })
  @IsOptional()
  @IsString()
  role?: number;

  @ApiProperty({ description: '性别', enum: Gender }) // 指定枚举类型
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
