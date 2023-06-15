import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({
    example: 'Lesson #1',
    description: 'The title of the course',
    type: String,
  })
  @IsNotEmpty()
  lesson_title: string;

  @ApiProperty({
    example: 'This lesson will help you undersatnd...',
    description: 'description for the course',
    type: String,
  })
  @IsOptional()
  lesson_description: string;

  @ApiProperty({
    example: 'The course will be about...',
    description: 'The content of the course',
    type: String,
  })
  @IsNotEmpty()
  lesson_content: string;

  @ApiProperty({
    example: 4,
    description: 'The total number of hours for the lesson',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  lesson_duration: number;

  @ApiProperty({
    example: false,
    description: 'The lesson status weather its active or not',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  lesson_status: boolean;
}
