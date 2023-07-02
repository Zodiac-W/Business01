import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsModule } from 'src/lessons/lessons.module';
import { Instructor_course } from 'src/users/entities/instructor-course.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course_lesson } from './entities/course-lesson.entity';
import { Course_meta } from './entities/course-meta.entity';
import { Course } from './entities/course.entity';
import { Course_quiz } from './entities/course-quiz.entity';
import { QuizzesModule } from 'src/quizzes/quizzes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Course_meta,
      Course_lesson,
      Instructor_course,
      Course_quiz,
    ]),
    LessonsModule,
    QuizzesModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
