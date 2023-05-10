import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: true })
class IsStringOrStringArrayConstraint implements ValidatorConstraintInterface {
  validate(value: string | string[], args: ValidationArguments) {
    return typeof value === 'string' || Array.isArray(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The value must be a string or array of strings';
  }
}

function IsStringOrStringArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrStringArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsStringOrStringArrayConstraint,
    });
  };
}

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

  @ApiProperty({ description: '标签', required: false, type: [String] })
  @IsOptional()
  @IsStringOrStringArray({ message: 'tagIds 必须是字符串或字符串数组' })
  tagIds?: string | string[];

  @ApiProperty({ description: '群组', required: false, type: [String] })
  @IsOptional()
  @IsStringOrStringArray({ message: 'groupIds 必须是字符串或字符串数组' })
  groupIds?: string | string[];

  @ApiProperty({ description: '收藏分组', required: false, type: [String] })
  @IsOptional()
  @IsStringOrStringArray({ message: 'collectionGroupIds 必须是字符串或字符串数组' })
  collectionGroupIds?: string | string[];
}
