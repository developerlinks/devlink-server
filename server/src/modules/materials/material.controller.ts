import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateMaterialPipe } from './pipes/create-material.pipe';
import { Material } from '../../entity/material.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('物料')
@Controller('material')
// @UseGuards(JwtGuard)
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post('')
  create(@Body(CreateMaterialPipe) dto: CreateMaterialDto) {
    const material = dto as unknown as Material;
    return this.materialService.create(material);
  }

  @Get()
  findAll() {
    return this.materialService.findAll();
  }
}
