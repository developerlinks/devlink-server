import { UserService } from './../user/user.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
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
import { TokenExpiredMessage } from 'src/constant';
import { QueryBaseDto } from './dto/get-group.dto';
import { GroupMaterialDto } from './dto/group-material.dto';
@ApiTags('分组')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '添加分组' })
  @Post('')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  addGroup(@Body(CreateGroupPipe) dto: CreateGroupDto, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return this.groupService.addGroup(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '查询自己的分组' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getGroup(@Query() query: QueryBaseDto, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    const userId = req.user.userId;

    return this.groupService.getGroup(userId, query);
  }

  @Post(':groupId/material/:materialId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async addMaterialToGroup(@Param() dto: GroupMaterialDto, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return await this.groupService.addMaterialToGroup(dto);
  }

  @Delete(':groupId/material/:materialId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async removeMaterialFromGroup(@Param() dto: GroupMaterialDto, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return await this.groupService.removeMaterialFromGroup(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除分组' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  deleteGroup(@Param('id') id: string, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return this.groupService.deleteGroup(id);
  }
}
