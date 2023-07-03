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
import { Student_quiz } from './entities/student-quiz.entity';
import { QuizzesModule } from 'src/quizzes/quizzes.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { Student_quiz_question } from './entities/student-quiz-question.entity';
import { DiscusionModule } from 'src/discusion/discusion.module';
import { Comment } from 'src/discusion/entities/comment.entity';
import { Comment_replay } from 'src/discusion/entities/comment-replay.entity';

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
      Student_quiz,
      Student_quiz_question,
      Comment,
      Comment_replay,
    ]),
    RolesModule,
    LessonsModule,
    CoursesModule,
    QuizzesModule,
    QuestionsModule,
    Student_quiz_question,
    DiscusionModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
