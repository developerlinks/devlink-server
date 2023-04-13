import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateGroupDto } from '../dto/create-group.dto';
import { Group } from '../../../entity/group.entity';

@Injectable()
export class CreateGroupPipe implements PipeTransform {
  transform(value: Group, metadata: ArgumentMetadata) {
    if (!value.description) {
      value.description = '这是一个描述...';
    }
    return value;
  }
}
