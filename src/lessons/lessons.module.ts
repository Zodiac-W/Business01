import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor_lesson } from 'src/users/entities/instructor-lesson.entity';
import { Lesson_meta } from './entities/lesson-meta.entity';
import { Lesson } from './entities/lesson.entity';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { Lesson_metadata_group } from './entities/lesson-meta-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lesson,
      Lesson_meta,
      Instructor_lesson,
      Lesson_metadata_group,
    ]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
