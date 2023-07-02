import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';

@Entity()
export class Course_quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => Course, (course) => course.course_quiz)
  course: Course;

  @ManyToOne((type) => Quiz, (quiz) => quiz.course_quiz)
  quiz: Quiz;
}
