import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Expose } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { Menus } from 'src/menus/menu.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @ManyToMany(() => User, user => user.roles)
  @Expose()
  users: User[];

  @ManyToMany(() => Menus, menus => menus.role)
  @Expose()
  menus: Menus[];
}
