import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Course_lesson } from 'src/courses/entities/course-lesson.entity';
import { Course_meta } from 'src/courses/entities/course-meta.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Lesson_meta } from 'src/lessons/entities/lesson-meta.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Role } from 'src/roles/entities/role.entity';
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
