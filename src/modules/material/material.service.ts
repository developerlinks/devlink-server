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
    const { limit, page, name, npmName, isPrivate, authorId, tagIds, groupIds } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;

    const queryBuilder = this.materialsRepository.createQueryBuilder('material');

    queryBuilder
      .leftJoinAndSelect('material.tags', 'tags')
      .leftJoinAndSelect('material.user', 'user')
      .leftJoinAndSelect('material.groups', 'groups');

    if (isPrivate !== undefined) {
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

    if (tagIds) {
      if (Array.isArray(tagIds)) {
        tagIds.forEach(tagId => {
          queryBuilder.andWhere('tags.id = :tagId', { tagId });
        });
      } else {
        queryBuilder.andWhere('tags.id = :tagIds', { tagIds });
      }
    }

    if (groupIds) {
      if (Array.isArray(groupIds)) {
        groupIds.forEach(groupId => {
          queryBuilder.andWhere('groups.id = :groupId', { groupId });
        });
      } else {
        queryBuilder.andWhere('groups.id = :groupIds', { groupIds });
      }
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
