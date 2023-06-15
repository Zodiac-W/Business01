import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User_meta } from './entities/user-meta.entity';
import { User_role } from './entities/user-role.entity';
import { RolesService } from 'src/roles/roles.service';
import { User_lesson } from './entities/user-lesson.entity';
import { LessonsService } from 'src/lessons/lessons.service';
import { UserLessonStatus } from './enums/user-lesson-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(User_meta)
    private user_metaRepository: Repository<User_meta>,
    @InjectRepository(User_role)
    private user_roleRepository: Repository<User_role>,
    private roleService: RolesService,
    @InjectRepository(User_lesson)
    private user_lessonRepository: Repository<User_lesson>,
    private lessonsService: LessonsService,
  ) {}

  async signupUser(createUserDto: CreateUserDto): Promise<any> {
    const {
      user_name,
      user_email,
      user_phone,
      user_pass,
      password_confirm,
      user_img,
      user_type,
    } = createUserDto;

    let exist: any;
    try {
      exist = await this.getUserByEmail(user_email);
    } catch (err) {}

    if (exist) {
      throw Error('This email address is already registered');
    }

    if (user_pass != password_confirm) {
      throw Error('Your passwords does not match');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user_pass, salt);

    const user = new User();
    user.user_name = user_name;
    user.user_email = user_email;
    user.user_phone = user_phone;
    user.user_pass = hash;
    user.user_img = user_img;
    user.user_type = user_type;

    await this.usersRepository.save(user);
    const { user_pass: pass, ...userPassed } = user;

    return userPassed;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const { user_email, user_pass } = loginUserDto;

    const user = await this.usersRepository.findOne({ where: { user_email } });

    if (!user) {
      throw Error('Incorrect Email');
    }
    const match = await bcrypt.compare(user_pass, user.user_pass);

    if (!match) {
      throw Error('Incorrect Password');
    }

    const { user_pass: pass, ...userPassed } = user;
    return userPassed;
  }

  async getUser(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw Error('User does not exist');
    }
    return user;
  }

  async validateUser(id: number): Promise<any> {
    const user = await this.getUser(id);
    if (!user) {
      return null;
    }

    const userId = user.id;
    return { userId };
  }
  async getAllUsers(): Promise<any> {
    const users = await this.usersRepository.find();
    return users;
  }

  async getAllUserNames(): Promise<any> {
    const names = await this.usersRepository.find({
      select: ['user_name'],
    });
    const usernames = names.map((name) => {
      return { username: name };
    });
    return usernames;
  }

  async deleteUser(id: number): Promise<any> {
    const user = await this.getUser(id);

    await this.usersRepository.softDelete(id);

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    let user = await this.getUser(id);

    user = { ...user, ...updateUserDto };
    await this.usersRepository.save(user);

    return user;
  }

  async getUserByEmail(email: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { user_email: email },
    });
    if (!user) {
      throw Error('User not found');
    }
    return user;
  }

  async getUserByPhone(phone: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { user_phone: phone },
    });
    return user;
  }

  async setUserNickname(nickname: string, id: number): Promise<any> {
    const user = await this.getUser(id);

    const user_meta = new User_meta();
    user_meta.meta_key = 'nickname';
    user_meta.meta_value = nickname;
    user_meta.user = user;
    await this.user_metaRepository.save(user_meta);
    return user_meta;
  }

  async getUserMeta(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['user_meta'],
    });

    const meta = user.user_meta;
    return meta;
  }

  async setUserMeta(id: number, key: string, value: string): Promise<any> {
    const user = await this.getUser(id);

    const user_meta = new User_meta();
    user_meta.meta_key = key;
    user_meta.meta_value = value;
    user_meta.user = user;

    await this.user_metaRepository.save(user_meta);
    return user_meta;
  }

  async setUserRole(userId: number, roleId: number): Promise<any> {
    const user = await this.getUser(userId);
    const role = await this.roleService.getRole(roleId);

    const user_role = new User_role();
    user_role.user = user;
    user_role.role = role;

    await this.user_roleRepository.save(user_role);
    return user_role;
  }

  async getUserRole(id: number) {
    const user_role = await this.user_roleRepository.findOne({
      where: { user: { id: id } },
      relations: ['role'],
    });

    const role = user_role.role;
    return role;
  }

  async deleteUserRole(id: number): Promise<any> {
    const user_role = await this.user_roleRepository.findOne({
      where: { user: { id: id } },
      relations: ['role', 'user'],
    });

    await this.user_roleRepository.softDelete(user_role.id);
    return user_role;
  }

  async updateUserRole(userId: number, roleId: number): Promise<any> {
    await this.deleteUserRole(userId);

    const user_role = await this.setUserRole(userId, roleId);
    return user_role;
  }

  async getUserLesson(id: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['user_lesson', 'user_lesson.lesson'],
    });
    const lessons = user.user_lesson;
    return lessons;
  }

  async setUserLesson(
    userId: number,
    lessonId: number,
    status: UserLessonStatus,
  ): Promise<any> {
    const user = await this.getUser(userId);
    const lesson = await this.lessonsService.getLesson(lessonId);

    const user_lesson = new User_lesson();
    user_lesson.user = user;
    user_lesson.lesson = lesson;
    user_lesson.user_lesson_status = status;

    await this.user_lessonRepository.save(user_lesson);
    return user_lesson;
  }
}
