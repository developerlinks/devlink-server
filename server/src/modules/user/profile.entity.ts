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
  @Exclude()
  gender: Gender;

  @Column({ default: '' })
  @Expose()
  photo: string;

  @Column({ default: '' })
  @Expose()
  address: string;

  @Column({ default: '' })
  @Exclude()
  description: string;

  @Column({ type: 'enum', enum: AccountType, default: AccountType.EMAIL })
  @Exclude()
  accountType: AccountType;

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

  constructor(partial?: Partial<Profile>) {
    this.id = uuidv4();
    this.gender = partial?.gender ?? Gender.OTHER;
    this.photo = partial?.photo ?? '';
    this.address = partial?.address ?? '';
    this.description = partial?.description ?? '';
    this.accountType = partial?.accountType ?? AccountType.EMAIL;
    this.refresh_token = partial?.refresh_token ?? '';
    this.refresh_token_expires_at = partial?.refresh_token_expires_at ?? 0;
  }
}
