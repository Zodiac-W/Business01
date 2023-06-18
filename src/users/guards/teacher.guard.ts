import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class Teacher implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;

    const user_type = await this.usersService.getUserType(id);
    console.log(user_type.user_type);

    if (
      user_type.user_type === 'teacher' ||
      user_type.user_type === 'superuser'
    ) {
      return true;
    } else {
      return false;
    }
  }
}
