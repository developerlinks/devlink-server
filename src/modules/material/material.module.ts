import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from '../../entity/material.entity';
import { User } from '../../entity/user.entity';
import { Tag } from '../../entity/tag.entity';
import { Group } from '../../entity/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Material, User, Tag, Group])],
  controllers: [MaterialController],
  providers: [MaterialService],
})
export class MaterialModule {}
