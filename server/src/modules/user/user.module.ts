import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Roles } from 'src/modules/roles/roles.entity';
import { Logs } from 'src/modules/logs/logs.entity';
import { Group } from '../group/group.entity';
import { Profile } from './profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Logs, Roles, Group, Profile])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
