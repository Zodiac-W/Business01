import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Quiz_meta } from './entities/quiz-meta.entity';
import { QuestionsModule } from 'src/questions/questions.module';
import { Quiz_question } from './entities/quiz-question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Quiz_meta, Quiz_question]),
    QuestionsModule,
  ],
  providers: [QuizzesService],
  controllers: [QuizzesController],
  exports: [QuizzesService],
})
export class QuizzesModule {}
