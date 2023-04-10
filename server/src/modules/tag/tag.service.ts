import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { Injectable } from '@nestjs/common';
import { Tag } from 'src/entity/tag.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { GetTagDto } from './dto/get-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(userId: string, createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    const userTmp = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    tag.user = userTmp;
    return this.tagRepository.save(tag);
  }

  async findAll(query: GetTagDto) {
    const { limit, page, name, username } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    const [data, total] = await this.tagRepository.findAndCount({
      select: {
        id: true,
        name: true,
        description: true,
      },
      relations: {
        user: true,
        material: true,
      },
      where: {
        name,
        user: {
          username,
        },
      },
      take,
      skip,
    });
    const totalPages = Math.ceil(total / limit);
    return { data, total, totalPages };
  }
}
