import { Expose } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Materials {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

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
  tag: string;

  @Expose()
  @Column()
  ignore: string;

  @Expose()
  @Column()
  ownerId: string;

  @Expose()
  @Column()
  isPrivate: boolean;

  @Expose()
  @Column()
  create_time: string;

  @Expose()
  @Column()
  update_time: string;

  @ManyToMany(() => User, user => user.materials)
  @Expose()
  @JoinColumn()
  user: User;
}
