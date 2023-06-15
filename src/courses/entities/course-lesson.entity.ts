import { Lesson } from 'src/lessons/entities/lesson.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class Course_lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => Course, (course) => course.course_lesson)
  course: Course;

  @ManyToOne((type) => Lesson, (lesson) => lesson.course_lesson)
  lesson: Lesson;
}
