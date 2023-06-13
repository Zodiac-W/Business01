import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The user email address',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @ApiProperty({
    example: 'Pssword123!',
    description: 'The user password',
    type: String,
  })
  @IsNotEmpty()
  user_pass: string;
}
