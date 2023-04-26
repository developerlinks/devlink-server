import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryBaseDto {
  @ApiProperty({ description: '页数', required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: '每页的数量', required: false })
  @IsOptional()
  limit?: number;
}

export class GetGroupDto extends QueryBaseDto {

  @ApiProperty({ description: '名字', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '用户名', required: false })
  @IsOptional()
  @IsString()
  username?: string;
}
