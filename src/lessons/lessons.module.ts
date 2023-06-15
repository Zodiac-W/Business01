import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson_meta } from './entities/lesson-meta.entity';
import { Lesson } from './entities/lesson.entity';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Lesson_meta])],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
