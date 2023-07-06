import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course_meta } from './course-meta.entity';

@Entity()
export class Course_metadata_group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_metadata_group_name: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(
    (type) => Course_meta,
    (course_meta) => course_meta.course_metadata_group,
  )
  course_meta: Course_meta[];
}
