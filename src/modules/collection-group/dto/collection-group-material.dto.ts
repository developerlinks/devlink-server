import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CollectionGroupMaterialDto {
  @ApiProperty({ description: '收藏分组Id' })
  @IsString()
  collectionGroupId: string;

  @ApiProperty({ description: '物料Id' })
  @IsString()
  materialId: string;
}
