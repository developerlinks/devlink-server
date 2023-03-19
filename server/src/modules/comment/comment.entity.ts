import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { v5 as uuidv5 } from 'uuid';
import { Material } from '../materials/material.entity';

@Entity()
export class Comment {
  @PrimaryColumn('uuid')
  id: string = uuidv5('comment', uuidv5.DNS);

  @Column()
  content: string;

  @Column()
  created_at: Date;

  @ManyToOne(() => Material, material => material.comments)
  materials: Material;

  @ManyToOne(() => Comment, comment => comment.children)
  parent: Comment;

  @OneToMany(() => Comment, comment => comment.parent)
  children: Comment[];
}
