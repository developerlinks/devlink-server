import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TextPolishDto {
  @ApiProperty({ description: '文字' })
  @IsString()
  @IsNotEmpty()
  text: string;
}
