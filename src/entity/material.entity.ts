import { Expose } from 'class-transformer';
import { User } from 'src/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
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
  @Column({ nullable: true })
  photo: string;

  @Expose()
  @Column({ nullable: true, type: 'mediumtext' })
  abstract: string;

  @Expose()
  @Column({ nullable: true, type: 'longtext' })
  description: string;

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
  @ManyToOne(() => User, user => user.materials)
  user: User;

  @ManyToMany(() => Tag, tag => tag.material)
  @Expose()
  @JoinTable({ name: 'material_tag' })
  tags: Tag[];

  @Expose()
  @ManyToMany(() => Group, group => group.materials)
  groups: Group[];

  @Expose()
  @OneToMany(() => Comment, comment => comment.material)
  comments: Comment[];

  @Expose()
  @OneToMany(() => Like, like => like.material)
  likes: Like[];

  @Expose()
  @ManyToMany(() => CollectionGroup, collectionGroup => collectionGroup.collectedMaterials)
  @JoinTable({ name: 'material_collection_group' })
  collectedInGroups: CollectionGroup[];
}
