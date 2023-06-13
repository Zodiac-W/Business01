import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { LoginUserDto } from 'src/users/dto/login-user-dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signupUser(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.signupUser(createUserDto);
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.usersService.loginUser(loginUserDto);
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUsers(payload: any): Promise<any> {
    const user = await this.usersService.validateUser(payload.sub);
    return user;
  }
}
