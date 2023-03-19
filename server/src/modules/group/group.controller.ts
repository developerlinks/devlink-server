import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';

@ApiTags('分组')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  get() {
    return this.groupService.get();
  }

  @Post()
  add() {
    return this.groupService.add();
  }
}
