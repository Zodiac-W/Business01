import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { Question } from 'src/questions/entities/question.entity';

@Entity()
export class Quiz_question {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => Quiz, (quiz) => quiz.quiz_question)
  quiz: Quiz;

  @ManyToOne((type) => Question, (question) => question.quiz_question)
  question: Question;
}
