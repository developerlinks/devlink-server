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
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Material } from './material.entity';
import { User } from './user.entity';

@Entity()
export class Group {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.group, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Material, material => material.group, {
    onDelete: 'SET NULL',
  })
  material: Material[];

  constructor(partial?: Partial<Group>) {
    this.id = uuidv4();
    this.name = '';
    this.description = '';
    Object.assign(this, partial);
  }
}
