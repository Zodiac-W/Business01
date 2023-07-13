import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    try {
      const user = await this.usersService.signupUser(createUserDto);
      if (user.message) {
        return user;
      }
      const payload = { sub: user.id };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    try {
      const user = await this.usersService.loginUser(loginUserDto);
      if (user.message) {
        return user;
      }
      const payload = { sub: user.id };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async validateUsers(payload: any): Promise<any> {
    try {
      const user = await this.usersService.validateUser(payload.sub);
      return user;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
