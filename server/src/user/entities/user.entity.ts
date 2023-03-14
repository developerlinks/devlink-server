import { Roles } from 'src/roles/entities/roles.entity';
import { Exclude } from 'class-transformer';

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Logs } from 'src/logs/logs.entity';
import { Materials } from 'src/materials/entities/material.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  // typescript -> 数据库 关联关系 Mapping
  @OneToMany(() => Logs, logs => logs.user, { cascade: true })
  logs: Logs[];

  @ManyToMany(() => Roles, roles => roles.users, { cascade: ['insert'] })
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, profile => profile.user, { cascade: true })
  profile: Profile;

  @ManyToMany(() => Materials, material => material.user, { cascade: true })
  @JoinTable({ name: 'users_materials' })
  materials: Materials[];
}
