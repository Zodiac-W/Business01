import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { StudentQuizStatus } from '../enums/student-quiz-status.enum';

export class CreateStudentQuizDto {
  @ApiProperty({
    example: 2,
    description: 'The selected user id',
    type: Number,
  })
  @IsNotEmpty()
  student_id: number;

  @ApiProperty({
    example: 4,
    description: 'The selected quiz id',
    type: Number,
  })
  @IsNotEmpty()
  quiz_id: number;

  @ApiProperty({
    example: 20,
    description: 'The student score in the quiz',
    type: Number,
  })
  @IsOptional()
  student_quiz_score: number;

  @ApiProperty({
    example: StudentQuizStatus.NOT_STARTED,
    description: 'The student status in the quiz',
    enum: StudentQuizStatus,
  })
  @IsOptional()
  @IsEnum(StudentQuizStatus)
  student_quiz_status: StudentQuizStatus;

  @ApiProperty({
    example: true,
    description: 'Weather the student quiz was reviewed or not',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  student_quiz_reviewed: boolean;
}
