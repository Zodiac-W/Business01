import { Lesson } from 'src/lessons/entities/lesson.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentLessonStatus } from '../enums/student-lesson-status.enum';
import { User } from './user.entity';

@Entity()
export class Student_lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StudentLessonStatus,
    default: StudentLessonStatus.NOT_STARTED,
  })
  student_lesson_status: StudentLessonStatus;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deltedAt: Date;

  @ManyToOne((type) => User, (user) => user.student_lesson)
  user: User;

  @ManyToOne((type) => Lesson, (lesson) => lesson.student_lesson)
  lesson: Lesson;
}
