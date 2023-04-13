import { Injectable, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entity/group.entity';
import { User } from 'src/entity/user.entity';

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
  async getGroup(id: string) {
    return this.groupRepository.find({
      where: {
        user: {
          id,
        },
      },
    });
  }
}
