import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Materials } from './entities/material.entity';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Materials) private readonly materialsRepository: Repository<Materials>,
  ) {}
  async create(createMaterialDto: CreateMaterialDto) {
    const materialTmp = await this.materialsRepository.create(createMaterialDto);
    console.log('materialTmp', materialTmp);
    const material = await this.materialsRepository.save(materialTmp);
    return material;
  }

  findAll() {
    return this.materialsRepository.find();
  }

  findOne(id: number) {
    return this.materialsRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateMaterialDto: UpdateMaterialDto) {
    return `This action updates a #${id} blog`;
  }

  async remove(id: number) {
    const material = await this.findOne(id);
    return this.materialsRepository.remove(material);
  }
}
