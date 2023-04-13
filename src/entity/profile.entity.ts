import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum AccountType {
  EMAIL = 'email',
  GITHUB = 'github',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
export class Profile {
  @PrimaryColumn('uuid')
  @Expose()
  id: string = uuidv4();

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Expose()
  @Column({ nullable: true })
  photo: string;

  @Column()
  @Expose()
  address: string;

  @Column()
  @Expose()
  description: string;

  @Column({ type: 'enum', enum: AccountType })
  accountType: AccountType;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ type: 'bigint', nullable: true })
  @Exclude()
  refreshTokenExpiresAt: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  @Expose()
  user: User;

  constructor(profile?: Partial<Profile>) {
    this.gender = profile?.gender ?? Gender.OTHER;
    this.address = profile?.address ?? '';
    this.description = profile?.description ?? '';
    this.accountType = profile?.accountType ?? AccountType.EMAIL;
    this.refreshToken = profile?.refreshToken ?? '';
    this.refreshTokenExpiresAt = profile?.refreshTokenExpiresAt ?? 0;
  }
}
