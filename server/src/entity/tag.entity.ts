import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Material } from './material.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Tag {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  create_at: string;

  @Column()
  update_at: string;

  @Column()
  count: number;

  @ManyToMany(() => Material, material => material.tag)
  material: Material[];
}
