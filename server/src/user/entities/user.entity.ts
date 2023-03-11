import { profile } from 'console';
import { Logs } from 'src/logs/entities/log.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Roles } from 'src/roles/entities/roles.entity';
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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Logs, logs => logs.user)
  logs: Logs[];

  @ManyToMany(() => Roles, role => role.users)
  @JoinTable({ name: 'users_roles' })
  roles: Roles[];

  @OneToOne(() => Profile, profile => profile.user)
  profile: Profile;
}
