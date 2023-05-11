import { Roles } from 'src/entity/roles.entity';
import { Exclude, Expose } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Logs } from 'src/entity/logs.entity';
import { Material } from 'src/entity/material.entity';
import { Profile } from 'src/entity/profile.entity';
import { Group } from './group.entity';
import { Like } from './like.entity';
import { Follow } from './follow.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Tag } from './tag.entity';
import { Comment } from './comment.entity';
import { CollectionGroup } from './collectionGroup.entity';
import { Device } from './device.entity';

export enum AccountType {
  EMAIL = 'email',
  GITHUB = 'github',
}

@Entity()
export class User {
  @ApiProperty()
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: AccountType })
  accountType: AccountType;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @OneToMany(() => Logs, logs => logs.user, { cascade: true })
  logs: Logs[];

  @ManyToMany(() => Roles, roles => roles.users)
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, profile => profile.user, { cascade: true })
  profile: Profile;

  @OneToMany(() => Group, group => group.user, { cascade: true, onDelete: 'CASCADE' })
  group: Group[];

  @OneToMany(() => Material, material => material.user)
  materials: Material[];

  @OneToMany(() => Like, like => like.user, { cascade: true })
  likes: Like[];

  @OneToMany(() => Follow, follow => follow.following)
  followers: Follow[];

  @OneToMany(() => Follow, follow => follow.follower)
  following: Follow[];

  @OneToMany(() => Tag, tag => tag.user, { cascade: true })
  tags: Tag[];

  @OneToMany(() => Comment, comment => comment.user, { cascade: true })
  comments: Comment[];

  @OneToMany(() => CollectionGroup, collectionGroup => collectionGroup.user)
  collectedInGroups: CollectionGroup[];

  @OneToMany(() => Device, device => device.user, { cascade: true })
  devices: Device[];
}
