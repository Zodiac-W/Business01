import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class Course_meta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  meta_key: string;

  @Column()
  meta_value: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => Course, (course) => course.course_meta)
  course: Course;
}
