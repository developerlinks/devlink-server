import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Material } from './material.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

@Entity()
export class Tag {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Material, material => material.tags)
  material: Material[];

  @ManyToOne(() => User, user => user.tags, { onDelete: 'SET NULL' })
  user: User;
}
