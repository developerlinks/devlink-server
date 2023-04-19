import { Injectable, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entity/group.entity';
import { User } from 'src/entity/user.entity';
import { GetMyGroupDto } from './dto/get-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(User) private userRepository: Repository<User>,
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
  async getGroup(id: string, query: GetMyGroupDto) {
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
      totalPages
    }
  }
}
