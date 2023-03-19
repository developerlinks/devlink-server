import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v5 as uuidv5 } from 'uuid';
import { User } from '../user/user.entity';

@Entity()
export class Follow {
  @PrimaryColumn('uuid')
  id: string = uuidv5('follow', uuidv5.DNS);

  @ManyToOne(() => User, user => user.following)
  follower: User;

  @ManyToOne(() => User, user => user.followers)
  following: User;

  @Column()
  followDate: Date;
}
