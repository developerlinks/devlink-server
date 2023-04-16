import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Group } from '../../entity/group.entity';
import { Tag } from '../../entity/tag.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from '../../entity/material.entity';
import { GetMaterialByTagsDto, GetMaterialDto } from './dto/get-material.dto';
import { User } from 'src/entity/user.entity';

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
          groupIds.map(groupId => this.groupRepository.findOne({ where: { id: groupId } })),
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
    const { limit, page, name, npmName, isPrivate, author, tag } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;

    const [data, total] = await this.materialsRepository.findAndCount({
      select: {
        id: true,
        name: true,
        npmName: true,
      },
      relations: {
        tags: true,
        user: true,
        groups: true,
      },
      where: {
        name,
        npmName,
        isPrivate,
        user: {
          username: author,
        },
        tags: {
          name: tag,
        },
      },
      take,
      skip,
    });
    const totalPages = Math.ceil(total / limit);
    return { data, total, totalPages };
  }

  findByTags(query: GetMaterialByTagsDto) {
    const { tags } = query;
  }

  findOne(id: string) {
    return this.materialsRepository.findOne({
      where: {
        id,
      },
    });
  }

  // update Material
  // async update(id: string, updateMaterialDto: UpdateMaterialDto) {
  //   const { tagIds, groupIds, ...rest } = updateMaterialDto;

  async remove(id: string) {
    const material = await this.findOne(id);
    return this.materialsRepository.remove(material);
  }

  // 更新物料
  async update(id: string, updateMaterialDto: UpdateMaterialDto) {
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
    });

    const newMaterial = this.materialsRepository.create({
      ...material,
      ...rest,
      tags,
      groups,
    });

    return await this.materialsRepository.save(newMaterial);
  }
}