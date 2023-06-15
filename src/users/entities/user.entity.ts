import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { User_lesson } from './user-lesson.entity';
import { User_meta } from './user-meta.entity';
import { User_role } from './user-role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_name: string;

  @Column()
  user_email: string;

  @Column()
  user_phone: string;

  @Column()
  user_pass: string;

  @Column()
  user_img: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.STUDENT_USER })
  user_type: UserType;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => User_meta, (user_meta) => user_meta.user)
  user_meta: User_meta[];

  @OneToMany((type) => User_role, (user_role) => user_role.user)
  user_role: User_role[];

  @OneToMany((type) => User_lesson, (user_lesson) => user_lesson.user)
  user_lesson: User_lesson[];
}
