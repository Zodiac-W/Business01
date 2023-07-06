import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson_meta } from './lesson-meta.entity';

@Entity()
export class Lesson_metadata_group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lesson_metadata_group_name: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(
    (type) => Lesson_meta,
    (lesson_meta) => lesson_meta.lesson_metadata_group,
  )
  lesson_meta: Lesson_meta[];
}
