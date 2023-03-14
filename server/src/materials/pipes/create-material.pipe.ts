import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateMaterialDto } from '../dto/create-material.dto';
import { Materials } from '../entities/material.entity';

@Injectable()
export class CreateUserPipe implements PipeTransform {
  transform(value: Materials, metadata: ArgumentMetadata) {
    value.create_time = Date.now() + '';
    value.update_time = Date.now() + '';
    return value;
  }
}
