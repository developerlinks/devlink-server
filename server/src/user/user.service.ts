import { Injectable, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { Roles } from 'src/roles/entities/roles.entity';
import * as argon2 from 'argon2';
import { getUserDto } from './dto/get-user.dto';
import { Logs } from 'src/logs/logs.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles) private readonly rolesRepository: Repository<Roles>,
  ) {}

  async create(user: Partial<User>) {
    if (!user.roles) {
      const role = await this.rolesRepository.findOne({ where: { id: 2 } });
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
    const res = await this.userRepository.save(userTmp);
    return res;
  }

  findAll(query: getUserDto) {
    const { limit, page, username, gender, role } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;

    return this.userRepository.find({
      select: {
        id: true,
        username: true,
        profile: {
          gender: true,
        },
      },
      relations: {
        profile: true,
        roles: true,
      },
      where: {
        // AND OR
        username,
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

  findOneById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: any, user: Partial<User>) {
    const userTemp = await this.findProfile(parseInt(id));
    const newUser = this.userRepository.merge(userTemp, user);
    // 联合模型更新，需要使用save方法或者queryBuilder
    return this.userRepository.save(newUser);

    // 下面的update方法，只适合单模型的更新，不适合有关系的模型更新
    // return this.userRepository.update(parseInt(id), newUser);
  }

  async remove(id: number) {
    // return this.userRepository.delete(id);
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  async findUserLogs(id: number) {
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
}
