import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { GetMaterialInGroupDto, GetMyCollectionGroupDto } from './dto/get-collection-group.dto';
import { CollectionGroup } from 'src/entity/collectionGroup.entity';
import { Material } from 'src/entity/material.entity';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CollectionGroupMaterialDto } from './dto/collection-group-material.dto';

@Injectable()
export class CollectionGroupService {
  constructor(
    @InjectRepository(CollectionGroup)
    private collectionGroupRepository: Repository<CollectionGroup>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Material) private materialRepository: Repository<Material>,
  ) {}

  async addGroup(id: string, group: Partial<CollectionGroup>) {
    const usertmp = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    group.user = usertmp;
    const groupTmp = await this.collectionGroupRepository.create(group);
    return this.collectionGroupRepository.save(groupTmp);
  }

  // 查询自己的分组
  async getGroup(id: string, query: GetMyCollectionGroupDto) {
    const { limit, page } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    const [collectionGroups, total] = await this.collectionGroupRepository.findAndCount({
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
      collectionGroups,
      total,
      totalPages,
    };
  }

  // 查询该收藏分组下的物料
  async getMaterialInGroup(id: string, query: GetMaterialInGroupDto) {
    const { limit, page } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    const [materials, total] = await this.materialRepository.findAndCount({
      where: {
        collectedInGroups: {
          id: id,
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
      materials,
      total,
      totalPages,
    };
  }

  async addMaterialToGroup(dto: CollectionGroupMaterialDto) {
    const { collectionGroupId, materialId } = dto;

    const collectionGroup = await this.collectionGroupRepository.findOne({
      where: {
        id: collectionGroupId,
      },
      relations: ['user', 'collectedMaterials'],
    });

    if (!collectionGroup) {
      throw new NotFoundException('收藏分组未找到');
    }

    const material = await this.materialRepository.findOne({
      where: { id: materialId },
      relations: ['collectedInGroups'],
    });

    if (!material) {
      throw new NotFoundException('物料未找到');
    }

    // 检查物料是否已经在收藏分组中
    const isMaterialAlreadyInGroup = collectionGroup.collectedMaterials.some(
      collectedMaterial => collectedMaterial.id === materialId,
    );

    if (isMaterialAlreadyInGroup) {
      throw new BadRequestException('物料已经在收藏分组中');
    }
    // 将物料添加到收藏分组
    material.collectedInGroups.push(collectionGroup);
    await this.materialRepository.save(material);
    return {
      material,
    };
  }

  async removeMaterialFromGroup(dto: CollectionGroupMaterialDto) {
    const { collectionGroupId, materialId } = dto;
    const collectionGroup = await this.collectionGroupRepository.findOne({
      where: {
        id: collectionGroupId,
      },
      relations: ['collectedMaterials'],
    });

    if (!collectionGroup) {
      throw new NotFoundException('收藏分组未找到');
    }

    const material = await this.materialRepository.findOne({
      where: { id: materialId },
      relations: ['collectedInGroups'],
    });

    if (!material) {
      throw new NotFoundException('物料未找到');
    }

    // 检查物料是否在收藏分组中
    const isMaterialAlreadyInGroup = collectionGroup.collectedMaterials.some(
      collectedMaterial => collectedMaterial.id === materialId,
    );

    if (!isMaterialAlreadyInGroup) {
      throw new BadRequestException('物料不在收藏分组中');
    }

    material.collectedInGroups = material.collectedInGroups.filter(
      group => group.id !== collectionGroupId,
    );

    await this.materialRepository.save(material);

    return {
      material,
    };
  }

  // 删除分组
  async deleteGroup(id: string) {
    const group = await this.collectionGroupRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
    // 该分组不存在
    if (!group) {
      return new NotFoundException('分组不存在');
    }
    return this.collectionGroupRepository.remove(group);
  }
}
