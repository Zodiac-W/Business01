import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';

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
}
