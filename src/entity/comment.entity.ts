import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Material } from './material.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'longtext' })
  content: string;

  @Column({ nullable: true })
  emoticon: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updateAt: Date;

  @ManyToOne(() => Material, material => material.comments)
  material: Material;

  @ManyToOne(() => Comment, comment => comment.children)
  parent: Comment;

  @OneToMany(() => Comment, comment => comment.parent)
  children: Comment[];

  @ManyToOne(() => User, user => user.comments)
  user: User;

  constructor(partial?: Partial<Comment>) {
    Object.assign(this, partial);
  }
}
