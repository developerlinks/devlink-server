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
  id: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Column({ default: '' })
  @Expose()
  photo: string;

  @Column({ default: '' })
  @Expose()
  address: string;

  @Column({ default: '' })
  @Expose()
  description: string;

  @Column({ type: 'enum', enum: AccountType, default: AccountType.EMAIL })
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

  constructor(partial?: Partial<Profile>) {
    this.id = uuidv4();
    this.gender = partial?.gender ?? Gender.OTHER;
    this.photo = partial?.photo ?? '';
    this.address = partial?.address ?? '';
    this.description = partial?.description ?? '';
    this.accountType = partial?.accountType ?? AccountType.EMAIL;
    this.refreshToken = partial?.refreshToken ?? '';
    this.refreshTokenExpiresAt = partial?.refreshTokenExpiresAt ?? 0;
  }
}
