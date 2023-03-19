import { Injectable, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { In, Repository } from 'typeorm';
import { Roles, RolesEnum } from 'src/modules/roles/roles.entity';
import * as argon2 from 'argon2';
import { getUserDto } from './dto/get-user.dto';
import { Logs } from 'src/modules/logs/logs.entity';
import { Group } from '../group/group.entity';
import { getServerConfig } from 'ormconfig';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles) private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
  ) {}

  async create(user: Partial<User>) {
    if (!user.roles) {
      const role = await this.rolesRepository.findOne({ where: { id: RolesEnum.user } });
      user.roles = [role];
    }
    if (user.roles instanceof Array && typeof user.roles[0] === 'number') {
      user.roles = await this.rolesRepository.find({
        where: {
          id: In(user.roles),
        },
      });
    }
    const userTmp = await this.userRepository.create(user);
    userTmp.password = await argon2.hash(userTmp.password);
    const group = new Group();
    group.create_at = Date.now().toString();
    userTmp.group = [group];

    const res = await this.userRepository.save(userTmp);
    return res;
  }

  findAll(query: getUserDto) {
    const { limit, page, username, email, gender, role } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;

    return this.userRepository.find({
      // TODO: select?
      select: {
        id: true,
        username: true,
        email: true,
        profile: {
          gender: true,
        },
      },
      relations: {
        profile: true,
        roles: true,
        group: true,
        likes: true,
        materials: true,
        followers: true,
        following: true,
      },
      where: {
        // AND OR
        username,
        email,
        profile: {
          gender,
        },
        roles: {
          id: role,
        },
      },
      take,
      skip,
    });
  }

  find(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.menus'],
    });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.menus'],
    });
  }

  findOneById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, user: Partial<User>) {
    const userTemp = await this.findProfile(id);
    const newUser = this.userRepository.merge(userTemp, user);
    // 联合模型更新，需要使用save方法或者queryBuilder
    return this.userRepository.save(newUser);

    // 下面的update方法，只适合单模型的更新，不适合有关系的模型更新
    // return this.userRepository.update(parseInt(id), newUser);
  }

  async remove(id: string) {
    // return this.userRepository.delete(id);
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  findProfile(id: string) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  async updatePassword(id: string, password: string) {
    const user = await this.findOneById(id);
    user.password = await argon2.hash(password);
    return this.userRepository.save(user);
  }

  async findUserLogs(id: string) {
    const user = await this.findOneById(id);
    return this.logsRepository.findOne({
      where: {
        user,
      },
      relations: {
        user: true,
      },
    });
  }

  findLogByGroup(id: number) {
    return this.logsRepository
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT("logs.result")', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('user.id = :id', { id })
      .groupBy('logs.result')
      .orderBy('result', 'ASC')
      .addOrderBy('count', 'DESC')
      .limit(1)
      .offset(1)
      .getRawMany();
  }

  async createAdminAccount() {
    const config = getServerConfig();
    const adminEmail = 'devlinkroot@163.com';
    const adminUserName = 'devlinkroot';
    const adminPassword = config['DB_PASSWORD'] as string;
    // 检查管理员账号是否已存在
    const existingAdmin = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      // 创建管理员账号
      const admin = new User();
      admin.username = adminUserName;
      admin.email = adminEmail;
      admin.password = await argon2.hash(adminPassword);
      const role = await this.rolesRepository.findOne({ where: { id: RolesEnum.super } });
      admin.roles = [role];

      const group = new Group();
      group.name = '默认分组';
      group.description = '这是一个分组描述....';
      group.create_at = Date.now().toString();
      admin.group = [group];

      try {
        await this.userRepository.save(admin);
        console.log('Admin account created successfully.');
      } catch (error) {
        console.log('Failed to create admin account:', error.message);
      }
    }
  }

  findUserGroup() {
    // TODO: 返回自己名下的
    return this.groupRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async addGroup(group: Partial<Group>) {
    // TODO: 添加自己的 group 4
    const usertmp = await this.userRepository.findOne({
      where: {
        id: '',
      },
    });
    group.user = usertmp;
    const groupTmp = await this.groupRepository.create(group);
    console.info('groupTmp', groupTmp);
    return this.groupRepository.save(groupTmp);
  }
}
