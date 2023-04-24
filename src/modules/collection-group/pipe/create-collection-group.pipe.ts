import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Group } from '../../../entity/group.entity';

@Injectable()
export class CreateCollectionGroupPipe implements PipeTransform {
  transform(value: Group, metadata: ArgumentMetadata) {
    if (!value.description) {
      value.description = '这是一个描述...';
    }
    return value;
  }
}
