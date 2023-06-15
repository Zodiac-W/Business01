import { Lesson } from 'src/lessons/entities/lesson.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserLessonStatus } from '../enums/user-lesson-status.enum';
import { User } from './user.entity';

@Entity()
export class User_lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserLessonStatus,
    default: UserLessonStatus.NOT_STARTED,
  })
  user_lesson_status: UserLessonStatus;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deltedAt: Date;

  @ManyToOne((type) => User, (user) => user.user_lesson)
  user: User;

  @ManyToOne((type) => Lesson, (lesson) => lesson.user_lesson)
  lesson: Lesson;
}
