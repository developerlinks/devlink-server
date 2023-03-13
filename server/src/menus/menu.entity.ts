import { Roles } from 'src/roles/entities/roles.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menus {
  @PrimaryGeneratedColumn()
  id: number;

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
