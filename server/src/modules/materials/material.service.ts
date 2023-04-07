import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Group } from '../../entity/group.entity';
import { Tag } from '../../entity/tag.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from '../../entity/material.entity';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material) private readonly materialsRepository: Repository<Material>,
    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}
  async create(material: Partial<Material>) {
    if (material.group instanceof Array && typeof material.group[0] === 'number') {
      material.group = await this.groupRepository.find({
        where: {
          id: In(material.group),
        },
      });
    }

    if (material.tag instanceof Array && typeof material.tag[0] === 'number') {
      material.tag = await this.tagRepository.find({
        where: {
          id: In(material.tag),
        },
      });
    }

    const materialTmp = await this.materialsRepository.create(material);

    return await this.materialsRepository.save(materialTmp);
  }

  findAll() {
    return this.materialsRepository.find();
  }

  findOne(id: string) {
    return this.materialsRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: string, updateMaterialDto: UpdateMaterialDto) {
    return `This action updates a #${id} blog`;
  }

  async remove(id: string) {
    const material = await this.findOne(id);
    return this.materialsRepository.remove(material);
  }
}
