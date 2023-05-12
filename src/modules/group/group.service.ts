import { BadRequestException, Injectable, NotFoundException, Req, UseGuards } from '@nestjs/common';
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
      relations: ['materials'],
    });

    if (!group) {
      throw new NotFoundException('找不到分组');
    }

    const material = await this.materialRepository.findOne({
      where: {
        id: materialId,
      },
      relations: ['groups'],
    });

    if (!material) {
      throw new NotFoundException('找不到物料');
    }

    // 检查物料是否已经在分组中
    const isMaterialAlreadyInGroup = group.materials.some(material => material.id === materialId);

    if (isMaterialAlreadyInGroup) {
      throw new BadRequestException('物料已经在分组中');
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
      relations: ['materials'],
    });

    if (!group) {
      throw new NotFoundException('找不到分组');
    }

    const material = await this.materialRepository.findOne({
      where: {
        id: materialId,
      },
      relations: ['groups'],
    });

    if (!material) {
      throw new NotFoundException('找不到物料');
    }

    // 检查物料是否在分组中
    const isMaterialAlreadyInGroup = group.materials.some(material => material.id === materialId);

    if (!isMaterialAlreadyInGroup) {
      throw new BadRequestException('物料不在分组中');
    }

    material.groups = material.groups.filter(group => group.id !== groupId);
    await this.materialRepository.save(material);

    return {
      material,
    };
  }
  // 删除分组
  async deleteGroup(id: string) {
    const group = await this.groupRepository.findOne({
      where: {
        id,
      },
    });
    // 该分组不存在
    if (!group) {
      return new NotFoundException('分组不存在');
    }

    return this.groupRepository.remove(group);
  }
}
