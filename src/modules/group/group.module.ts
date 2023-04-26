import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './group.controller';
import { Group } from '../../entity/group.entity';
import { GroupService } from './group.service';
import { UserModule } from '../user/user.module';
import { User } from 'src/entity/user.entity';
import { Material } from 'src/entity/material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User, Material])],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
