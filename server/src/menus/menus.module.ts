import { Module } from '@nestjs/common';
import { MenusController } from './menus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusService } from './menus.service';
import { Menus } from './menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menus])],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
