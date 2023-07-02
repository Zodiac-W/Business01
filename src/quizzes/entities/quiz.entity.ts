import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz_meta } from './quiz-meta.entity';
import { Quiz_question } from './quiz-question.entity';
import { Student_quiz } from 'src/users/entities/student-quiz.entity';
import { Course_quiz } from 'src/courses/entities/course-quiz.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quiz_title: string;

  @Column()
  quiz_description: string;

  @Column()
  quiz_passing_score: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => Quiz_meta, (quiz_meta) => quiz_meta.quiz)
  quiz_meta: Quiz_meta[];

  @OneToMany((type) => Quiz_question, (quiz_question) => quiz_question.quiz)
  quiz_question: Quiz_question[];

  @OneToMany((type) => Student_quiz, (student_quiz) => student_quiz.quiz)
  student_quiz: Student_quiz[];

  @OneToMany((type) => Course_quiz, (course_quiz) => course_quiz.quiz)
  course_quiz: Course_quiz[];
}
