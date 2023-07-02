import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiscusionStatus } from '../enum/discusion-status.enum';

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
}
