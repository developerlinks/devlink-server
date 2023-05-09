import { Injectable, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entity/group.entity';
import { User } from 'src/entity/user.entity';
import { QueryBaseDto } from './dto/get-group.dto';
import { Material } from 'src/entity/material.entity';
import { GroupMaterialDto } from './dto/group-material.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Material) private materialRepository: Repository<Material>,
  ) {}

  async addGroup(id: string, group: Partial<Group>) {
    const usertmp = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    group.user = usertmp;
    const groupTmp = await this.groupRepository.create(group);
    return this.groupRepository.save(groupTmp);
  }

  // 查询自己的分组
  async getGroup(id: string, query: QueryBaseDto) {
    const { limit, page } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    const [groups, total] = await this.groupRepository.findAndCount({
      where: {
        user: {
          id,
        },
      },
      take,
      skip,
    });
    const totalPages = Math.ceil(total / limit);

    return {
      groups,
      total,
      totalPages,
    };
  }

  // 查询该分组下的物料
  async getMaterialsByGroupId(groupId: string, query: QueryBaseDto) {
    const { limit, page } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    const [materials, total] = await this.materialRepository.findAndCount({
      where: {
        groups: {
          id: groupId,
        },
      },
      take,
      skip,
    });
    if (materials.length === 0) {
      return new NotFoundException('不存在');
    }
    const totalPages = Math.ceil(total / limit);

    return {
      materials: materials,
      total,
      totalPages,
    };
  }

  async addMaterialToGroup(dto: GroupMaterialDto) {
    const { groupId, materialId } = dto;
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
    });
    const material = await this.materialRepository.findOne({
      where: {
        id: materialId,
      },
      relations: ['groups'],
    });

    if (!group || !material) {
      throw new NotFoundException('找不到分组或物料');
    }

    material.groups.push(group);
    await this.materialRepository.save(material);

    return {
      material,
    };
  }

  async removeMaterialFromGroup(dto: GroupMaterialDto) {
    const { groupId, materialId } = dto;
    const group = await this.groupRepository.findOne({
      where: {
        id: groupId,
      },
    });

    const material = await this.materialRepository.findOne({
      where: {
        id: materialId,
      },
      relations: ['groups'],
    });

    if (!group || !material) {
      throw new NotFoundException('找不到分组或物料');
    }

    material.groups = material.groups.filter(group => group.id !== groupId);
    await this.materialRepository.save(material);

    return {
      material,
    };
  }
}
