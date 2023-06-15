import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsModule } from 'src/lessons/lessons.module';
import { RolesModule } from 'src/roles/roles.module';
import { User_lesson } from './entities/user-lesson.entity';
import { User_meta } from './entities/user-meta.entity';
import { User_role } from './entities/user-role.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, User_meta, User_role, User_lesson]),
    RolesModule,
    LessonsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
