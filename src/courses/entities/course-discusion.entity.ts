import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Discusion } from 'src/discusion/entities/discusion.entity';

@Entity()
export class Course_discusion {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: number;

  @DeleteDateColumn()
  deletedAt: number;

  @ManyToOne((type) => Course, (course) => course.course_discusion)
  course: Course;

  @ManyToOne((type) => Discusion, (discusion) => discusion.course_discusion)
  discusion: Discusion;
}
