import { Expose } from 'class-transformer';
import { group } from 'console';
import { User } from 'src/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Comment } from './comment.entity';
import { Group } from './group.entity';
import { Like } from './like.entity';
import { Tag } from './tag.entity';

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
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.materials, { cascade: true, onDelete: 'SET NULL' })
  author: User;

  @ManyToMany(() => Tag, tag => tag.material)
  @Expose()
  @JoinTable({ name: 'material_tag' })
  tag: Tag[];

  @ManyToOne(() => Group, group => group.material, { cascade: true })
  @JoinTable({ name: 'material_group' })
  group: Group[];

  @OneToMany(() => Comment, comment => comment.materials)
  comments: Comment[];

  @OneToMany(() => Like, like => like.materials)
  likes: Like[];

  // 用户收藏的物料
  @ManyToMany(() => User, user => user.stars)
  stars: User[];
}
