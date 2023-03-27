import { Roles } from 'src/modules/roles/roles.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Menu {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  order: number;

  // 不要通过string存数组 -> 5个操作策略
  // -> CREATE, READ, UPDATE, DELETE, MANAGE
  @Column()
  acl: string;

  // 一个role对应多个menu及控制权限
  @ManyToMany(() => Roles, roles => roles.menus)
  @JoinTable({ name: 'role_menus' })
  role: Roles;
}
