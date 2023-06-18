import { Course } from 'src/courses/entities/course.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentCourseStatus } from '../enums/student-course-status.enum';
import { User } from './user.entity';

@Entity()
export class Student_course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StudentCourseStatus,
    default: StudentCourseStatus.NOT_STARTED,
  })
  student_course_status: StudentCourseStatus;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => User, (user) => user.student_course)
  user: User;

  @ManyToOne((type) => Course, (course) => course.student_course)
  course: Course;
}
