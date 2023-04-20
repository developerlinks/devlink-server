import { Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
  PrimaryColumn,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Material } from './material.entity';
import { User } from './user.entity';

@Entity()
export class Group {
  @PrimaryColumn('uuid')
  id: string;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  description: string;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.group, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToMany(() => Material, material => material.groups)
  material: Material[];

  constructor(partial?: Partial<Group>) {
    this.id = uuidv4();
    this.name = '';
    this.description = '';
    Object.assign(this, partial);
  }
}
