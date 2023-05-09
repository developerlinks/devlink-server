import { ForbiddenException, Injectable, NotFoundException, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../entity/user.entity';
import { In, Repository } from 'typeorm';
import { Roles, RolesEnum } from 'src/entity/roles.entity';
import * as argon2 from 'argon2';
import { getUserDto } from './dto/get-user.dto';
import { Logs } from 'src/entity/logs.entity';
import { Group } from '../../entity/group.entity';
import { getServerConfig } from 'ormconfig';
import { Gender, Profile } from '../../entity/profile.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { CollectionGroup } from 'src/entity/collectionGroup.entity';
import { FuzzyQueryDto } from './dto/fuzzy-query.dto';
import { Material } from 'src/entity/material.entity';
import { Tag } from 'src/entity/tag.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles) private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRedis() private readonly redis: Redis,
    private configService: ConfigService,
  ) {}

  async create(user: Partial<User>) {
    const role = await this.rolesRepository.findOne({ where: { id: RolesEnum.user } });
    user.roles = [role];

    // 重名检测
    const userByUsername = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });

    if (userByUsername) {
      throw new ForbiddenException('用户名已存在');
    }

    // 邮箱重复检测
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (userByEmail) {
      throw new ForbiddenException('邮箱已存在，可找回密码');
    }

    const userTmp = await this.userRepository.create(user);
    userTmp.password = await argon2.hash(userTmp.password);
    const group = new Group({ name: '默认分组', description: '默认分组' });
    const collectionGroup = new CollectionGroup({ name: '默认收藏夹', description: '默认收藏夹' });
    const profile = new Profile({ gender: Gender.OTHER });
    userTmp.group = [group];
    userTmp.collectedInGroups = [collectionGroup];
    userTmp.profile = profile;
    const res = await this.userRepository.save(userTmp);
    return res;
  }

  async findAll(query: getUserDto) {
    const { limit, page, username, email, gender, role } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;

    const [data, total] = await this.userRepository.findAndCount({
      relations: {
        profile: true,
        roles: true,
      },
      where: {
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
    const totalPages = Math.ceil(total / limit);

    return { data, total, totalPages };
  }

  find(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'profile'],
    });
  }

  findOneById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  // 联合模型更新，需要使用save方法或者queryBuilder，
  // update方法，只适合单模型的更新，不适合有关系的模型更新
  async update(id: string, updateUserDto: UpdateUserDto) {
    const userTemp = await this.findProfile(id);

    const { address, description, gender, avatar, photo } = updateUserDto;

    Object.assign(userTemp.profile, {
      ...(address && { address }),
      ...(description && { description }),
      ...(gender && { gender }),
      ...(avatar && { avatar }),
      ...(photo && { photo }),
    });

    const newUser = this.userRepository.merge(userTemp, updateUserDto);
    return this.userRepository.save(newUser);
  }

  async updatePassword(passwordDto: UpdatePasswordDto) {
    const { email, code, password } = passwordDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    const getCode = await this.redis.get(`${email}_code`);
    if (!code || code !== getCode) {
      throw new ForbiddenException('验证码已过期');
    } else {
      this.redis.del(`${email}_code`);
    }

    user.password = await argon2.hash(password);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return this.userRepository.remove(user);
  }

  async findProfile(id: string) {
    const userInfo = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
        group: true,
        materials: true,
        likes: true,
        followers: true,
        following: true,
      },
    });
    if (!userInfo) {
      throw new NotFoundException('用户不存在');
    }
    return userInfo;
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
    const adminEmail = config['user'] as string;
    const adminUserName = 'devlinkroot';
    const adminPassword = config['DB_PASSWORD'] as string;

    const existingAdmin = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      // 创建管理员账号
      const adminData: Partial<User> = {
        username: adminUserName,
        email: adminEmail,
        password: adminPassword,
        roles: [RolesEnum.super] as any,
      };

      try {
        await this.create(adminData);
        console.log('Admin account created successfully');
      } catch (error) {
        console.log('Failed to create admin account: ', error.message);
      }
    }
  }

  async fuzzyQuery(dto: FuzzyQueryDto) {
    const { limit, page, keyword } = dto;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    if (!keyword) {
      return {
        data: [
          {
            reason: '关键词为空',
            items: [],
            total: 0,
            totalPages: 0,
          },
        ],
      };
    }
    const buildQuery = async (
      repository: Repository<any>,
      entity: string,
      condition: string,
      reason: string,
      // includeUser: boolean = false,
    ) => {
      const [items, total] = await buildQueryBuilder(
        repository,
        entity,
        condition,
        keyword,
        take,
        skip,
      );
      return {
        reason,
        items,
        total,
        totalPages: Math.ceil(total / limit),
      };
    };

    const buildQueryBuilder = (
      repository: Repository<any>,
      entity: string,
      condition: string,
      keyword: string,
      take: number,
      skip: number,
    ) => {
      const query = repository
        .createQueryBuilder(entity)
        .where(condition, { keyword: `%${keyword}%` })
        .orderBy(`${entity}.createdAt`, 'ASC')
        .take(take)
        .skip(skip);

      if (entity === 'Material') {
        query.leftJoinAndSelect(`${entity}.user`, 'user');
        query.leftJoinAndSelect(`user.profile`, 'profile');
        query.leftJoinAndSelect(`${entity}.tags`, 'tags');
      }

      return query.getManyAndCount();
    };

    const queries = [
      buildQuery(
        this.materialRepository,
        'Material',
        'LOWER(Material.name) LIKE LOWER(:keyword)',
        'material.name',
      ),
      buildQuery(
        this.userRepository,
        'User',
        'LOWER(User.username) LIKE LOWER(:keyword)',
        'user.username',
      ),
      buildQuery(this.tagRepository, 'Tag', 'LOWER(Tag.name) LIKE LOWER(:keyword)', 'tag.name'),
    ];

    const combinedResults = await Promise.all(queries);
    return {
      data: combinedResults,
    };
  }
}
