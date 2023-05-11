import { Entity, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Material } from './material.entity';
import { User } from './user.entity';

@Entity()
export class Like {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @ManyToOne(() => User, user => user.likes)
  user: User;

  @ManyToOne(() => Material, material => material.likes)
  material: Material; // 修改此处

  @CreateDateColumn()
  likeDate: Date;
}
