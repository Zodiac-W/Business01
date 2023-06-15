import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Admin',
    description: 'The name fo the role',
    type: String,
  })
  @IsNotEmpty()
  role_title: string;

  @ApiProperty({
    example: 'This role gives you the ability to do...',
    description: 'Information about the role',
    type: String,
  })
  @IsOptional()
  role_description: string;
}
