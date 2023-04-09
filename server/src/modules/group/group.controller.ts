import { UserService } from './../user/user.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GroupService } from './group.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateGroupPipe } from './pipe/create-group.pipe';
import { CreateGroupDto } from './dto/create-group.dto';
@ApiTags('分组')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '添加分组' })
  @Post(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  addGroup(@Body(CreateGroupPipe) dto: CreateGroupDto, @Param('id') id: string, @Req() req) {
    if (id !== req.user.userId) {
      throw new UnauthorizedException();
    }
    return this.groupService.addGroup(id, dto);
  }

  @Get()
  @ApiOperation({ summary: '查询自己的分组' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getGroup(@Req() req) {
    const userId = req.user.userId;

    return this.groupService.getGroup(userId);
  }
}
