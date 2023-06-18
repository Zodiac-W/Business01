import { Course } from 'src/courses/entities/course.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InstructorCourseStatus } from '../enums/instructor-course-status.enum';
import { User } from './user.entity';

@Entity()
export class Instructor_course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: InstructorCourseStatus,
    default: InstructorCourseStatus.NOT_STARTED,
  })
  instructor_course_status: InstructorCourseStatus;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => User, (user) => user.instructor_course)
  user: User;

  @ManyToOne((type) => Course, (course) => course.instructor_course)
  course: Course;
}
