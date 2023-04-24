import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMaterialIncollectionGroup {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  materialId: string;
}
