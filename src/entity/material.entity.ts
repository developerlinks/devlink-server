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
import { CollectionGroup } from './collectionGroup.entity';

@Entity()
export class Material {
  @Expose()
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Expose()
  @Column({ unique: true })
  name: string;

  @Expose()
  @Column({ unique: true })
  npmName: string;

  @Expose()
  @Column()
  description: string = ''; // TODO:

  @Expose()
  @Column()
  version: string;

  @Expose()
  @Column({ nullable: true })
  installCommand: string;

  @Expose()
  @Column({ nullable: true })
  startCommand: string;

  @Expose()
  @Column({ nullable: true })
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

  @Expose()
  @ManyToOne(() => User, user => user.materials, { cascade: true, onDelete: 'SET NULL' })
  user: User;

  @ManyToMany(() => Tag, tag => tag.material)
  @Expose()
  @JoinTable({ name: 'material_tag' })
  tags: Tag[];

  @Expose()
  @ManyToMany(() => Group, group => group.materials)
  @JoinTable({ name: 'material_group' })
  groups: Group[];

  @Expose()
  @OneToMany(() => Comment, comment => comment.materials)
  comments: Comment[];

  @Expose()
  @OneToMany(() => Like, like => like.materials)
  likes: Like[];

  @Expose()
  @ManyToMany(() => CollectionGroup, collectionGroup => collectionGroup.collectedMaterials)
  collectedInGroups: CollectionGroup[];
}
