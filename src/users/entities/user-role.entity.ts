import { Role } from 'src/roles/entities/role.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class User_role {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAT: Date;

  @ManyToOne((type) => User, (user) => user.user_role)
  user: User;

  @ManyToOne((type) => Role, (role) => role.user_role)
  role: Role;
}
