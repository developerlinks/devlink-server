import { Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Material } from '../materials/material.entity';
import { User } from '../user/user.entity';

@Entity()
export class Group {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  create_at: string;

  @ManyToOne(() => User, user => user.group, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Material, material => material.group, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  material: Material[];

  constructor(partial?: Partial<Group>) {
    this.id = uuidv4();
    this.name = '';
    this.description = '';
    this.create_at = new Date().toISOString();
    Object.assign(this, partial);
  }
}
