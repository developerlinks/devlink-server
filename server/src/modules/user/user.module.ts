import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Roles } from 'src/modules/roles/roles.entity';
import { Logs } from 'src/modules/logs/logs.entity';
import { Group } from '../group/group.entity';
import { JwtMiddleware } from 'src/middleware/jwt.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User, Logs, Roles, Group])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
// export class UserModule {}
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('/user');
  }
}
