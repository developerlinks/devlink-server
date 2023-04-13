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
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateMaterialPipe } from './pipes/create-material.pipe';
import { Material } from '../../entity/material.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMaterialByTagsDto, GetMaterialDto } from './dto/get-material.dto';

@ApiTags('物料')
@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post('')
  @ApiOperation({ summary: '创建物料' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body(CreateMaterialPipe) dto: CreateMaterialDto, @Req() req) {
    if (!req.user.userId) {
      throw new UnauthorizedException();
    }
    return this.materialService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '查询所有的标签' })
  search(@Query() query: GetMaterialDto) {
    return this.materialService.findAll(query);
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
      throw new UnauthorizedException();
    }
    return this.materialService.update(id, updateMaterialDto);
  }
}
