import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  npmName: string;

  @IsString()
  @ApiProperty()
  version: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  abstract: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  installCommand: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  startCommand: string;

  @ApiProperty()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ignore?: string;

  @ApiProperty()
  @IsArray()
  tagIds?: string[];

  @ApiProperty()
  @IsArray()
  groupIds?: string[];
}
