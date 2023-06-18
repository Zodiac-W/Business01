import { Lesson } from 'src/lessons/entities/lesson.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InstructorLessonStatus } from '../enums/instructor-lesson-status.enum';
import { User } from './user.entity';

@Entity()
export class Instructor_lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: InstructorLessonStatus,
    default: InstructorLessonStatus.NOT_STARTED,
  })
  instructor_lesson_status: InstructorLessonStatus;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => User, (user) => user.instructor_lesson)
  user: User;

  @ManyToOne((type) => Lesson, (lesson) => lesson.instructor_lesson)
  lesson: Lesson;
}
