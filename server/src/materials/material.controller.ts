import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateUserPipe } from './pipes/create-material.pipe';

@Controller('material')
// @UseGuards(JwtGuard)
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post('')
  create(@Body(CreateUserPipe) createBlogDto: any) {
    console.log('req', createBlogDto);
    return this.materialService.create(createBlogDto);
  }

  @Get()
  findAll() {
    return this.materialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateMaterialDto) {
    return this.materialService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialService.remove(+id);
  }
}
