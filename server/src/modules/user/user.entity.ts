import { Roles } from 'src/modules/roles/roles.entity';
import { Exclude } from 'class-transformer';
import { v5 as uuidv5 } from 'uuid';

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Logs } from 'src/modules/logs/logs.entity';
import { Material } from 'src/modules/materials/material.entity';
import { Profile } from 'src/modules/profile/profile.entity';
import { Group } from '../group/group.entity';
import { Like } from '../like/like.entity';
import { Follow } from '../follow/follow.entity';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string = uuidv5('user', uuidv5.DNS);

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  // typescript -> 数据库 关联关系 Mapping
  @OneToMany(() => Logs, logs => logs.user, { cascade: true })
  logs: Logs[];

  @ManyToMany(() => Roles, roles => roles.users)
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, profile => profile.user, { cascade: true })
  profile: Profile;

  @OneToMany(() => Group, group => group.user)
  group: Group[];

  @OneToMany(() => Material, material => material.author)
  materials: Material[];

  @OneToMany(() => Like, like => like.user, { cascade: true })
  likes: Like[];

  @OneToMany(() => Follow, follow => follow.follower, { cascade: true })
  followers: Follow[];

  @OneToMany(() => Follow, follow => follow.following, { cascade: true })
  following: Follow[];
}
