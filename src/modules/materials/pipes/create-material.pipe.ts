import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateMaterialDto } from '../dto/create-material.dto';
import { Material } from '../../../entity/material.entity';

@Injectable()
export class CreateMaterialPipe implements PipeTransform {
  transform(value: Material, metadata: ArgumentMetadata) {
    return value;
  }
}
