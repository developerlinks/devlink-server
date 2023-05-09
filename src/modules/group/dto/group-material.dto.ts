import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GroupMaterialDto {
  @ApiProperty({ description: '分组Id' })
  @IsString()
  groupId: string;

  @ApiProperty({ description: '物料Id' })
  @IsString()
  materialId: string;
}
