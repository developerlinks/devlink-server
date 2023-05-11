import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { User } from 'src/entity/user.entity';
import { Material } from 'src/entity/material.entity';
import { Like } from 'src/entity/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Material, Like])],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
