import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/modules/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

enum AccountType {
  EMAIL = 'email',
  GITHUB = 'github',
}

@Entity()
export class Profile {
  @PrimaryColumn('uuid')
  @Expose()
  id: string = uuidv4();

  @Column()
  @Expose()
  gender: number;

  @Column()
  @Expose()
  photo: string;

  @Column()
  @Expose()
  address: string;

  @Column()
  @Exclude()
  description: string;

  @Column()
  @Exclude()
  accountType: string;

  @Column({ nullable: true })
  @Expose()
  refresh_token: string;

  @Column({ type: 'bigint', nullable: true })
  @Expose()
  refresh_token_expires_at: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Expose()
  user: User;

  constructor() {
    this.accountType = this.accountType ?? AccountType.EMAIL;
  }
}
