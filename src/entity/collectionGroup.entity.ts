import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Material } from './material.entity';
import { User } from './user.entity';

@Entity()
export class CollectionGroup {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @Column({ nullable: true, type: 'longtext' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.collectedInGroups, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  user: User;

  @ManyToMany(() => Material, material => material.collectedInGroups)
  collectedMaterials: Material[];

  constructor(partial?: Partial<CollectionGroup>) {
    this.name = '';
    this.description = '';
    Object.assign(this, partial);
  }
}
