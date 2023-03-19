import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateGroupDto } from '../dto/create-group.dto';
import { Group } from '../group.entity';

@Injectable()
export class CreateGroupPipe implements PipeTransform {
  transform(value: Group, metadata: ArgumentMetadata) {
    if (!value.create_at) {
      value.create_at = Date.now() + '';
    }
    if (!value.description) {
      value.description = '这是一个描述...';
    }
    return value;
  }
}
