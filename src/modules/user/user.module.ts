import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/entity/roles.entity';
import { Logs } from 'src/entity/logs.entity';
import { Group } from '../../entity/group.entity';
import { Profile } from 'src/entity/profile.entity';
import { User } from 'src/entity/user.entity';
import { Tag } from 'src/entity/tag.entity';
import { Material } from 'src/entity/material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Logs, Roles, Group, Profile, Tag, Material])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
