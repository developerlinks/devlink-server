import { Expose } from 'class-transformer';
import { User } from 'src/modules/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v5 as uuidv5 } from 'uuid';

@Entity()
export class Profile {
  @PrimaryColumn('uuid')
  @Expose()
  id: string = uuidv5('user', uuidv5.DNS);

  @Column()
  @Expose()
  gender: number;

  @Column()
  @Expose()
  photo: string;

  @Column()
  @Expose()
  address: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Expose()
  user: User;
}
