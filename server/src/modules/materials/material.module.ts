import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './material.entity';
import { User } from 'src/modules/user/user.entity';
import { Tag } from '../tag/tag.entity';
import { Group } from '../group/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Material, User, Tag, Group])],
  controllers: [MaterialController],
  providers: [MaterialService],
})
export class MaterialModule {}
