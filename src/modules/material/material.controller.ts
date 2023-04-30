import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UnauthorizedException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseFilters,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateMaterialPipe } from './pipes/create-material.pipe';
import { Material } from '../../entity/material.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetMaterialByTagsDto, GetMaterialDto } from './dto/get-material.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { TokenExpiredMessage } from 'src/constant';

@ApiTags('物料')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post('')
  @ApiOperation({ summary: '创建物料' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body(CreateMaterialPipe) dto: CreateMaterialDto, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return this.materialService.create(req.user.userId, dto);
  }

  @ApiOperation({ summary: '获取物料详情' })
  @ApiResponse({ status: 200, description: '成功获取物料详情' })
  @Get('detail')
  getUserProfile(@Query('id') id: string) {
    return this.materialService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: '查询所有的物料' })
  search(@Query() query: GetMaterialDto) {
    return this.materialService.findAll(query);
  }

  @Get('myself')
  @ApiOperation({ summary: '查询自己的物料' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  searchMySelf(@Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return this.materialService.findMySelf(req.user.userId);
  }

  @Post('search/byTags')
  @ApiOperation({ summary: '通过多个标签查询' })
  searchByTag(@Body() query: GetMaterialByTagsDto) {
    return this.materialService.findByTags(query);
  }

  // 更新物料
  @Patch(':id')
  @ApiOperation({ summary: '更新物料' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return this.materialService.update(id,req.user.userId, updateMaterialDto);
  }

  // 删除物料
  @Delete(':id')
  @ApiOperation({ summary: '删除物料' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }
    return this.materialService.remove(id, req.user.userId);
  }

}
