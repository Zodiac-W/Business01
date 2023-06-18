import { Course_lesson } from 'src/courses/entities/course-lesson.entity';
import { Course_meta } from 'src/courses/entities/course-meta.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Lesson_meta } from 'src/lessons/entities/lesson-meta.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Instructor_course } from 'src/users/entities/instructor-course.entity';
import { Instructor_lesson } from 'src/users/entities/instructor-lesson.entity';
import { Student_course } from 'src/users/entities/student-course.entity';
import { Student_lesson } from 'src/users/entities/student-lesson.entity';
import { User_meta } from 'src/users/entities/user-meta.entity';
import { User_role } from 'src/users/entities/user-role.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  entities: [
    User,
    User_meta,
    Course,
    Course_meta,
    Role,
    User_role,
    Lesson,
    Lesson_meta,
    Course_lesson,
    Student_lesson,
    Student_course,
    Instructor_course,
    Instructor_lesson,
  ],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: './migrations',
    subscribersDir: 'subscriber',
  },
} as DataSourceOptions);
