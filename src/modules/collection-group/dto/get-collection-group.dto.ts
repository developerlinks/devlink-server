import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetMyCollectionGroupDto {
  @ApiProperty({ description: '页数', required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: '每页的数量', required: false })
  @IsOptional()
  limit?: number;
}

export class GetCollectionGroupDto extends GetMyCollectionGroupDto {
  @ApiProperty({ description: '名字', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '用户名', required: false })
  @IsOptional()
  @IsString()
  username?: string;
}

export class GetMaterialInGroupDto extends GetMyCollectionGroupDto {
  @ApiProperty({ description: '分组id', required: false })
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({ description: '物料名', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'npm包名', required: false })
  @IsOptional()
  @IsString()
  npmName?: string;
}
