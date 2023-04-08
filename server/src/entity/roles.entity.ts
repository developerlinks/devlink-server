import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Expose } from 'class-transformer';
import { User } from 'src/entity/user.entity';
import { Menu } from 'src/entity/menu.entity';

export enum RolesEnum {
  super,
  admin,
  user,
}

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

  @ManyToMany(() => Menu, menu => menu.role)
  @Expose()
  menus: Menu[];
}