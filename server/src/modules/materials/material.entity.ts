import { Expose } from 'class-transformer';
import { group } from 'console';
import { User } from 'src/modules/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Comment } from '../comment/comment.entity';
import { Group } from '../group/group.entity';
import { Like } from '../like/like.entity';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Material {
  @Expose()
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  npmName: string;

  @Expose()
  @Column()
  version: string;

  @Expose()
  @Column()
  installCommand: string;

  @Expose()
  @Column()
  startCommand: string;

  @Expose()
  @Column()
  ignore: string;

  @Expose()
  @Column()
  isPrivate: boolean;

  @Expose()
  @Column()
  create_time: string;

  @Expose()
  @Column()
  update_time: string;

  @Expose()
  @Column()
  views: number;

  @Expose()
  @Column()
  likes_count: number;

  @Expose()
  @Column()
  comments_count: number;

  @ManyToOne(() => User, user => user.materials, { cascade: true, onDelete: 'SET NULL' })
  author: User;

  @ManyToMany(() => Tag, tag => tag.material)
  @Expose()
  @JoinTable({ name: 'material_tag' })
  tag: Tag[];

  @ManyToOne(() => Group, group => group.material)
  @JoinTable({ name: 'material_group' })
  group: Group[];

  @OneToMany(() => Comment, comment => comment)
  comments: Comment[];

  @OneToMany(() => Like, like => like.materials)
  likes: Like[];
}
