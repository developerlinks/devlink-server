import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { Logs } from 'src/logs/logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Logs, Roles])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
