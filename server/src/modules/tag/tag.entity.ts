import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Material } from '../materials/material.entity';
import { v5 as uuidv5 } from 'uuid';

@Entity()
export class Tag {
  @PrimaryColumn('uuid', { default: uuidv5('tag', uuidv5.DNS) })
  id: string;

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
