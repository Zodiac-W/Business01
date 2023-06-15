import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course_lesson } from './course-lesson.entity';
import { Course_meta } from './course-meta.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_title: string;

  @Column()
  course_description: string;

  @Column()
  course_duration: number;

  @Column()
  course_status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => Course_meta, (course_meta) => course_meta.course)
  course_meta: Course_meta[];

  @OneToMany((tpye) => Course_lesson, (course_lesson) => course_lesson.course)
  course_lesson: Course_lesson[];
}
