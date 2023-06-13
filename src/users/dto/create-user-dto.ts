import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';
import { UserType } from '../enums/user-type.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The user full name',
    type: String,
  })
  @IsNotEmpty()
  @Length(4, 40)
  user_name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The user email address',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @ApiProperty({
    example: '(+20) 100 132 1021 ',
    description: 'The user phone number',
    type: String,
  })
  @IsNotEmpty()
  user_phone: string;

  @ApiProperty({
    example: 'Pssword123!',
    description: 'The user password',
    type: String,
  })
  @IsNotEmpty()
  @IsStrongPassword()
  user_pass: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Matches('user_pass')
  password_confirm: string;

  @ApiProperty({
    example: 'https://img-server/user-0.png',
    description: 'The URL for the profile image for the user',
    type: String,
  })
  @IsOptional()
  @IsUrl()
  user_img: string;

  @ApiProperty({
    example: UserType.STUDENT_USER,
    description: 'The type of the user',
    enum: UserType,
  })
  @IsNotEmpty()
  @IsEnum(UserType)
  user_type: UserType;
}
