import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  npmName: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  installCommand: string;

  @ApiProperty()
  startCommand: string;

  @ApiProperty()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  ignore?: string;

  @ApiProperty()
  tag?: string[];

  @ApiProperty()
  group?: string[];
}
