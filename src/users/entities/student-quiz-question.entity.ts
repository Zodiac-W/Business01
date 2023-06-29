import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student_quiz } from './student-quiz.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Answer } from 'src/questions/entities/answer.entity';

@Entity()
export class Student_quiz_question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_quiz_question_answer_txt: string;

  @Column({ default: null })
  student_quiz_question_is_correct: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(
    (type) => Student_quiz,
    (student_quiz) => student_quiz.student_quiz_question,
  )
  student_quiz: Student_quiz;

  @ManyToOne((type) => Question, (question) => question.student_quiz_question)
  question: Question;

  @ManyToOne((type) => Answer, (answer) => answer.student_quiz_question)
  answer: Answer;
}
