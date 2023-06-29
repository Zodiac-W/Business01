import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Student_quiz_question } from 'src/users/entities/student-quiz-question.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answer_txt: string;

  @Column()
  answer_is_correct: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => Question, (question) => question.answer)
  question: Question;

  @OneToMany(
    (type) => Student_quiz_question,
    (student_quiz_question) => student_quiz_question.answer,
  )
  student_quiz_question: Student_quiz_question[];
}
