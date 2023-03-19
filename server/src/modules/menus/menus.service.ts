import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './menu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenusService {
  constructor(@InjectRepository(Menu) private menuRepository: Repository<Menu>) {}

  async create(createMenuDto: CreateMenuDto) {
    const menu = await this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(menu);
  }

  findAll() {
    return this.menuRepository.find();
  }

  findOne(id: string) {
    return this.menuRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const menu = await this.findOne(id);
    const newMenu = await this.menuRepository.merge(menu, updateMenuDto);
    return this.menuRepository.save(newMenu);
    return '';
  }

  remove(id: string) {
    return this.menuRepository.delete(id);
  }
}
