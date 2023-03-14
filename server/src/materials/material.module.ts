import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materials } from './entities/material.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Materials, User])],
  controllers: [MaterialController],
  providers: [MaterialService],
})
export class MaterialModule {}
