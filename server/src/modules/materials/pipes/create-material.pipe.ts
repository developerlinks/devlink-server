import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateMaterialDto } from '../dto/create-material.dto';
import { Material } from '../material.entity';

@Injectable()
export class CreateMaterialPipe implements PipeTransform {
  transform(value: Material, metadata: ArgumentMetadata) {
    value.create_time = Date.now() + '';
    value.update_time = Date.now() + '';
    value.views = 0;
    value.likes_count = 0;
    value.comments_count = 0;
    return value;
  }
}
