import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from 'src/courses/courses.module';
import { LessonsModule } from 'src/lessons/lessons.module';
import { RolesModule } from 'src/roles/roles.module';
import { Instructor_course } from './entities/instructor-course.entity';
import { Instructor_lesson } from './entities/instructor-lesson.entity';
import { Student_course } from './entities/student-course.entity';
import { Student_lesson } from './entities/student-lesson.entity';
import { User_meta } from './entities/user-meta.entity';
import { User_role } from './entities/user-role.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      User_meta,
      User_role,
      Student_lesson,
      Student_course,
      Instructor_course,
      Instructor_lesson,
    ]),
    RolesModule,
    LessonsModule,
    CoursesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
