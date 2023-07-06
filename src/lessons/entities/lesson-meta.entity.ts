import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { Lesson_metadata_group } from './lesson-meta-group.entity';

@Entity()
export class Lesson_meta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  meta_key: string;

  @Column()
  meta_value: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => Lesson, (lesson) => lesson.lesson_meta)
  lesson: Lesson;

  @ManyToOne(
    (type) => Lesson_metadata_group,
    (lesson_metadata_group) => lesson_metadata_group.lesson_meta,
  )
  lesson_metadata_group: Lesson_metadata_group;
}
