import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity()
export class Comment_replay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment_replay_txt: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => User, (user) => user.comment_replay)
  user: User;

  @ManyToOne((type) => Comment, (comment) => comment.comment_replay)
  comment: Comment;
}
