import { UserService } from '../user/user.service';
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
import { CollectionGroupService } from './collection-group.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateColletcionGroupDto } from './dto/create-collection-group.dto';
import { GetMaterialInGroupDto, GetMyCollectionGroupDto } from './dto/get-collection-group.dto';
import { CreateCollectionGroupPipe } from './pipe/create-collection-group.pipe';
import { AddMaterialIncollectionGroup } from './dto/add-material-in-collection-group.dto';
import { TokenExpiredMessage } from 'src/constant';
@ApiTags('收藏分组')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('collection_group')
export class CollectionGroupController {
  constructor(private readonly collectionGroupService: CollectionGroupService) {}

  @ApiOperation({ summary: '添加收藏分组' })
  @Post('')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  addGroup(@Body(CreateCollectionGroupPipe) dto: CreateColletcionGroupDto, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return this.collectionGroupService.addGroup(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '查询自己的收藏分组' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getGroup(@Query() query: GetMyCollectionGroupDto, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    const userId = req.user.userId;

    return this.collectionGroupService.getGroup(userId, query);
  }

  // 将物料添加到收藏分组
  @Post(':id/material')
  @ApiOperation({ summary: '将物料添加到收藏分组' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  addMaterialToGroup(@Param('id') id: string, @Body() body: AddMaterialIncollectionGroup, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    const userId = req.user.userId;
    return this.collectionGroupService.addMaterialToGroup(id, userId, body.materialId);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询该收藏分组下的物料' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  getMaterial(@Param('id') id: string, @Query() query: GetMaterialInGroupDto, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    const userId = req.user.userId;
    return this.collectionGroupService.getMaterialInGroup(id, userId, query);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除收藏分组' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  deleteGroup(@Param('id') id: string, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    const userId = req.user.userId;
    return this.collectionGroupService.deleteGroup(id, userId);
  }
}