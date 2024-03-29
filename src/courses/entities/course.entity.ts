import { Instructor_course } from 'src/users/entities/instructor-course.entity';
import { Student_course } from 'src/users/entities/student-course.entity';
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
import { Course_quiz } from './course-quiz.entity';
import { Course_discusion } from './course-discusion.entity';

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

  @OneToMany(
    (type) => Student_course,
    (student_course) => student_course.course,
  )
  student_course: Student_course[];

  @OneToMany(
    (type) => Instructor_course,
    (instructor_course) => instructor_course.course,
  )
  instructor_course: Instructor_course[];

  @OneToMany((type) => Course_quiz, (course_quiz) => course_quiz.course)
  course_quiz: Course_quiz[];

  @OneToMany(
    (type) => Course_discusion,
    (course_discusion) => course_discusion.course,
  )
  course_discusion: Course_discusion[];
}
