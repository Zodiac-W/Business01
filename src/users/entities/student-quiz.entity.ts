import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentQuizStatus } from '../enums/student-quiz-status.enum';
import { User } from './user.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Student_quiz_question } from './student-quiz-question.entity';

@Entity()
export class Student_quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  student_quiz_score: number;

  @Column({
    type: 'enum',
    enum: StudentQuizStatus,
    default: StudentQuizStatus.NOT_STARTED,
  })
  student_quiz_status: StudentQuizStatus;

  @Column({ default: false })
  student_quiz_reviewed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => User, (user) => user.student_quiz)
  user: User;

  @ManyToOne((type) => Quiz, (quiz) => quiz.student_quiz)
  quiz: Quiz;

  @OneToMany(
    (type) => Student_quiz_question,
    (student_quiz_question) => student_quiz_question.student_quiz,
  )
  student_quiz_question: Student_quiz_question[];
}
