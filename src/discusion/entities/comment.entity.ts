import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Discusion } from './discusion.entity';
import { Comment_replay } from './comment-replay.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment_txt: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne((type) => User, (user) => user.comment)
  user: User;

  @ManyToOne((type) => Discusion, (discusion) => discusion.comment)
  discusion: Discusion;

  @OneToMany(
    (type) => Comment_replay,
    (comment_replay) => comment_replay.comment,
  )
  comment_replay: Comment_replay[];
}
