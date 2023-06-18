import { Course_lesson } from 'src/courses/entities/course-lesson.entity';
import { Instructor_lesson } from 'src/users/entities/instructor-lesson.entity';
import { Student_lesson } from 'src/users/entities/student-lesson.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson_meta } from './lesson-meta.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lesson_title: string;

  @Column()
  lesson_description: string;

  @Column()
  lesson_content: string;

  @Column()
  lesson_duration: number;

  @Column()
  lesson_status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => Lesson_meta, (lesson_meta) => lesson_meta.lesson)
  lesson_meta: Lesson_meta[];

  @OneToMany((type) => Course_lesson, (course_lesson) => course_lesson.lesson)
  course_lesson: Course_lesson[];

  @OneToMany(
    (type) => Student_lesson,
    (student_lesson) => student_lesson.lesson,
  )
  student_lesson: Student_lesson[];

  @OneToMany(
    (type) => Instructor_lesson,
    (instructor_lesson) => instructor_lesson.lesson,
  )
  instructor_lesson: Instructor_lesson[];
}
