import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v5 as uuidv5 } from 'uuid';
import { Material } from '../materials/material.entity';
import { User } from '../user/user.entity';

@Entity()
export class Like {
  @PrimaryColumn('uuid')
  id: string = uuidv5('like', uuidv5.DNS);

  @ManyToOne(() => User, user => user.likes)
  user: User;

  @ManyToOne(() => Material, material => material.likes)
  materials: Material;

  @Column()
  likeDate: Date;
}
