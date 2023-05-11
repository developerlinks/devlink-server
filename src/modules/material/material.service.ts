import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Group } from '../../entity/group.entity';
import { Tag } from '../../entity/tag.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from '../../entity/material.entity';
import { GetMaterialDto } from './dto/get-material.dto';
import { User } from 'src/entity/user.entity';
import { TokenExpiredMessage } from 'src/constant';
import { ensureArray } from 'src/utils';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material) private readonly materialsRepository: Repository<Material>,
    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(userId: string, createMaterialDto: CreateMaterialDto): Promise<Material> {
    const { tagIds, groupIds, ...rest } = createMaterialDto;

    const tags = tagIds
      ? await Promise.all(tagIds.map(tagId => this.tagRepository.findOne({ where: { id: tagId } })))
      : [];

    const groups = groupIds
      ? await Promise.all(
          groupIds.map(groupId =>
            this.groupRepository.findOne({
              where: { id: groupId },
            }),
          ),
        )
      : [];

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const material = this.materialsRepository.create({
      ...rest,
      tags,
      groups,
      user,
    });

    return await this.materialsRepository.save(material);
  }

  async findAll(query: GetMaterialDto) {
    const {
      limit,
      page,
      name,
      npmName,
      isPrivate,
      authorId,
      tagIds,
      groupIds,
      collectionGroupIds,
      collectorId,
    } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;

    const queryBuilder = this.materialsRepository.createQueryBuilder('material');

    queryBuilder
      .leftJoinAndSelect('material.tags', 'tags')
      .leftJoinAndSelect('material.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('material.groups', 'groups')
      .leftJoinAndSelect('material.collectedInGroups', 'collectedInGroups')
      .leftJoinAndSelect('collectedInGroups.user', 'collectionUser');

    const tagIdsArray = tagIds ? ensureArray(tagIds) : undefined;
    const groupIdsArray = groupIds ? ensureArray(groupIds) : undefined;
    const collectionGroupIdsArray = collectionGroupIds
      ? ensureArray(collectionGroupIds)
      : undefined;

    if (collectorId) {
      queryBuilder.andWhere('collectionUser.id = :collectorId', { collectorId });
    }

    if (collectionGroupIdsArray) {
      collectionGroupIdsArray.forEach((collectionGroupId, index) => {
        queryBuilder.andWhere('collectedInGroups.id = :collectionGroupId' + index, {
          [`collectionGroupId${index}`]: collectionGroupId,
        });
      });
    }

    if (isPrivate) {
      queryBuilder.andWhere('material.isPrivate = :isPrivate', { isPrivate });
    }

    if (authorId) {
      queryBuilder.andWhere('user.id = :authorId', { authorId });
    }

    if (name) {
      queryBuilder.andWhere('material.name LIKE :name', { name: `%${name}%` });
    }

    if (npmName) {
      queryBuilder.andWhere('material.npmName LIKE :npmName', { npmName: `%${npmName}%` });
    }

    if (tagIdsArray) {
      tagIdsArray.forEach((tagId, index) => {
        queryBuilder.andWhere(
          `material.id IN (
          SELECT materialId
          FROM material_tag
          WHERE tagId = :tagId${index}
        )`,
          { [`tagId${index}`]: tagId },
        );
      });
    }

    if (groupIdsArray) {
      groupIdsArray.forEach((groupId, index) => {
        queryBuilder.andWhere(
          `material.id IN (
          SELECT materialId
          FROM material_group
          WHERE groupId = :groupId${index}
        )`,
          { [`groupId${index}`]: groupId },
        );
      });
    }

    if (collectionGroupIdsArray) {
      collectionGroupIdsArray.forEach((collectionGroupId, index) => {
        queryBuilder.andWhere(
          `material.id IN (
          SELECT materialId
          FROM material_collection_group
          WHERE collectionGroupId = :collectionGroupId${index}
        )`,
          { [`collectionGroupId${index}`]: collectionGroupId },
        );
      });
    }

    queryBuilder.orderBy('material.createdAt', 'DESC');

    const [materials, total] = await queryBuilder.take(take).skip(skip).getManyAndCount();

    const totalPages = Math.ceil(total / take);
    return { materials, total, totalPages };
  }

  async findMySelf(id: string) {
    const [materials, total] = await this.materialsRepository.findAndCount({
      where: {
        user: {
          id,
        },
      },
      relations: {
        user: {
          profile: true,
        },
        tags: true,
        groups: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      materials,
      total,
    };
  }

  async findOne(id: string) {
    const material = await this.materialsRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: {
          profile: true,
          likes: true,
          followers: true,
          following: true,
          materials: true,
        },
        tags: true,
        groups: true,
        collectedInGroups: {
          user: true,
        },
      },
    });
    if (!material) {
      throw new NotFoundException('未找到该物料');
    }
    return material;
  }

  // update Material
  // async update(id: string, updateMaterialDto: UpdateMaterialDto) {
  //   const { tagIds, groupIds, ...rest } = updateMaterialDto;

  async remove(id: string, userId: string) {
    const material = await this.materialsRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });

    if (userId !== material.user.id) {
      throw new ForbiddenException('权限不足');
    }

    return this.materialsRepository.remove(material);
  }

  // 更新物料
  async update(id: string, userId: string, updateMaterialDto: UpdateMaterialDto) {
    const { tagIds, groupIds, ...rest } = updateMaterialDto;

    const tags = tagIds
      ? await Promise.all(tagIds.map(tagId => this.tagRepository.findOne({ where: { id: tagId } })))
      : null;

    const groups = groupIds
      ? await Promise.all(
          groupIds.map(groupId => this.groupRepository.findOne({ where: { id: groupId } })),
        )
      : null;

    const material = await this.materialsRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
    if (userId !== material.user.id) {
      throw new UnauthorizedException(TokenExpiredMessage);
    }

    const newMaterial = this.materialsRepository.create({
      ...material,
      ...rest,
      tags,
      groups,
    });

    return await this.materialsRepository.save(newMaterial);
  }
}
