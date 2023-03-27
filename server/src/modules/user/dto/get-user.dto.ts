import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { RolesEnum } from 'src/modules/roles/roles.entity';

export class getUserDto {
  @ApiProperty({ description: '页数' })
  @IsNumber()
  page: number;

  @ApiProperty({ description: '每页的数量' })
  @IsNumber()
  limit?: number;

  @ApiProperty({ description: '用户名' })
  @IsString()
  username?: string;

  @ApiProperty({ description: '邮箱' })
  @IsString()
  email?: string;

  @ApiProperty({ description: '角色', enum: RolesEnum })
  @IsString()
  role?: number;

  @ApiProperty({ description: '性别' })
  @IsString()
  gender?: number;
}
