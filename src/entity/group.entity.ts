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
  id: string = uuidv4();

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column({ nullable: true, type: 'longtext' })
  description: string;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.group, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToMany(() => Material, material => material.groups, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'material_group' })
  materials: Material[];

  constructor(partial?: Partial<Group>) {
    Object.assign(this, partial);
  }
}
