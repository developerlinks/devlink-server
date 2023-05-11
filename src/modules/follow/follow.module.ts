import { Module } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { Material } from 'src/entity/material.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { Follow } from 'src/entity/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Material, Follow])],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}
