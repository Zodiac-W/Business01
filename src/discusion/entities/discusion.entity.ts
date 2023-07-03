import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiscusionStatus } from '../enum/discusion-status.enum';
import { Comment } from './comment.entity';
import { Course_discusion } from 'src/courses/entities/course-discusion.entity';

@Entity()
export class Discusion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  discusion_txt: string;

  @Column({
    type: 'enum',
    enum: DiscusionStatus,
    default: DiscusionStatus.OPEN,
  })
  discusion_status: DiscusionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany((type) => Comment, (comment) => comment.discusion)
  comment: Comment[];

  @ManyToOne(
    (type) => Course_discusion,
    (course_discusion) => course_discusion.discusion,
  )
  course_discusion: Course_discusion[];
}
