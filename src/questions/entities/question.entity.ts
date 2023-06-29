import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionType } from '../enums/question-type.enum';
import { Answer } from './answer.entity';
import { Question_meta } from './question-meta.entity';
import { Quiz_question } from 'src/quizzes/entities/quiz-question.entity';
import { Student_quiz_question } from 'src/users/entities/student-quiz-question.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question_txt: string;

  @Column({ type: 'enum', enum: QuestionType, default: QuestionType.MCQ })
  question_type: QuestionType;

  @Column()
  question_score: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => Question_meta, (question_meta) => question_meta.question)
  question_meta: Question_meta[];

  @OneToMany((type) => Answer, (answer) => answer.question)
  answer: Answer[];

  @OneToMany((type) => Quiz_question, (quiz_question) => quiz_question.question)
  quiz_question: Quiz_question[];

  @OneToMany(
    (type) => Student_quiz_question,
    (student_quiz_question) => student_quiz_question.question,
  )
  student_quiz_question: Student_quiz_question[];
}
