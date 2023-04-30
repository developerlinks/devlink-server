import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsArray } from 'class-validator';

export class GetMaterialDto {
  @ApiProperty({ description: '页数', required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: '每页的数量', required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ description: '名字', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '包名', required: false })
  @IsOptional()
  @IsString()
  npmName?: string;

  @ApiProperty({ description: '拥有者', required: false })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiProperty({ description: '是否公开', required: false })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @ApiProperty({ description: '标签', required: false })
  @IsOptional()
  @IsString()
  tag?: string;
}

export class GetMaterialByTagsDto {
  @ApiProperty({ description: '标签', required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
