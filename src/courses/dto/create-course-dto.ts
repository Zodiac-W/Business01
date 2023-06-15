import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Learn 01',
    description: 'The course title',
    type: String,
  })
  @IsNotEmpty()
  course_title: string;

  @ApiProperty({
    example: 'This course is going to help you learn the...',
    description: 'description for the course',
    type: String,
  })
  @IsOptional()
  course_description: string;

  @ApiProperty({
    example: 30,
    description: 'The total course hours',
    type: Number,
  })
  course_duration: number;

  @ApiProperty({
    example: true,
    description: 'The course status weather its active or not',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  course_status: boolean;
}
