import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Course_discusion } from 'src/courses/entities/course-discusion.entity';
import { Course_lesson } from 'src/courses/entities/course-lesson.entity';
import { Course_metadata_group } from 'src/courses/entities/course-meta-group.entity';
import { Course_meta } from 'src/courses/entities/course-meta.entity';
import { Course_quiz } from 'src/courses/entities/course-quiz.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Comment_replay } from 'src/discusion/entities/comment-replay.entity';
import { Comment } from 'src/discusion/entities/comment.entity';
import { Discusion } from 'src/discusion/entities/discusion.entity';
import { Lesson_metadata_group } from 'src/lessons/entities/lesson-meta-group.entity';
import { Lesson_meta } from 'src/lessons/entities/lesson-meta.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Answer } from 'src/questions/entities/answer.entity';
import { Question_meta } from 'src/questions/entities/question-meta.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Quiz_meta } from 'src/quizzes/entities/quiz-meta.entity';
import { Quiz_question } from 'src/quizzes/entities/quiz-question.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Instructor_course } from 'src/users/entities/instructor-course.entity';
import { Instructor_lesson } from 'src/users/entities/instructor-lesson.entity';
import { Student_course } from 'src/users/entities/student-course.entity';
import { Student_lesson } from 'src/users/entities/student-lesson.entity';
import { Student_quiz_question } from 'src/users/entities/student-quiz-question.entity';
import { Student_quiz } from 'src/users/entities/student-quiz.entity';
import { User_meta } from 'src/users/entities/user-meta.entity';
import { User_role } from 'src/users/entities/user-role.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions() {
    return {
      type: this.configService.get('database.type'),
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.database'),
      synchronize: this.configService.get('database.synchronize'),
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
        Quiz,
        Quiz_meta,
        Question,
        Question_meta,
        Answer,
        Quiz_question,
        Student_quiz,
        Student_quiz_question,
        Course_quiz,
        Discusion,
        Comment,
        Course_discusion,
        Comment_replay,
        Course_metadata_group,
        Lesson_metadata_group,
      ],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: './migrations',
        subscribersDir: 'subscriber',
      },
    };
  }
}
