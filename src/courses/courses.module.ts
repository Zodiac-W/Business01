import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsModule } from 'src/lessons/lessons.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course_lesson } from './entities/course-lesson.entity';
import { Course_meta } from './entities/course-meta.entity';
import { Course } from './entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Course_meta, Course_lesson]),
    LessonsModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
