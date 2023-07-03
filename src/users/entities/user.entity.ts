import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { Instructor_course } from './instructor-course.entity';
import { Instructor_lesson } from './instructor-lesson.entity';
import { Student_course } from './student-course.entity';
import { Student_lesson } from './student-lesson.entity';
import { User_meta } from './user-meta.entity';
import { User_role } from './user-role.entity';
import { Student_quiz } from './student-quiz.entity';
import { Comment } from 'src/discusion/entities/comment.entity';
import { Comment_replay } from 'src/discusion/entities/comment-replay.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_name: string;

  @Column()
  user_email: string;

  @Column()
  user_phone: string;

  @Column()
  user_pass: string;

  @Column()
  user_img: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.STUDENT_USER })
  user_type: UserType;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => User_meta, (user_meta) => user_meta.user)
  user_meta: User_meta[];

  @OneToMany((type) => User_role, (user_role) => user_role.user)
  user_role: User_role[];

  @OneToMany((type) => Student_lesson, (student_lesson) => student_lesson.user)
  student_lesson: Student_lesson[];

  @OneToMany((type) => Student_course, (student_course) => student_course.user)
  student_course: Student_course[];

  @OneToMany(
    (type) => Instructor_course,
    (instructor_course) => instructor_course.user,
  )
  instructor_course: Instructor_course[];

  @OneToMany(
    (type) => Instructor_lesson,
    (instructor_lesson) => instructor_lesson.user,
  )
  instructor_lesson: Instructor_lesson[];

  @OneToMany((type) => Student_quiz, (student_quiz) => student_quiz.user)
  student_quiz: Student_quiz[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany((type) => Comment_replay, (comment_replay) => comment_replay.user)
  comment_replay: Comment_replay[];
}
