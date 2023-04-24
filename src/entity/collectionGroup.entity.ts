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

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.collectedInGroups, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToMany(() => Material, material => material.collectedInGroups)
  @JoinTable({
    name: 'collection_group_material',
  })
  collectedMaterials: Material[];

  constructor(partial?: Partial<CollectionGroup>) {
    this.name = '';
    this.description = '';
    Object.assign(this, partial);
  }
}
