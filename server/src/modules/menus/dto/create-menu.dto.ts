import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNumber()
  @IsOptional()
  order: number;

  @IsString()
  @IsOptional()
  acl: string;
}
