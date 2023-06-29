import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStudentQuizQuestionDto {
  @ApiProperty({
    example: 2,
    description: 'The selected user id',
    type: Number,
  })
  @IsNotEmpty()
  student_quiz_id: number;

  @ApiProperty({
    example: 4,
    description: 'The selected question id',
    type: Number,
  })
  @IsNotEmpty()
  question_id: number;

  @ApiProperty({
    example: 6,
    description: 'The selected answer id',
    type: Number,
  })
  @IsNotEmpty()
  answer_id: number;

  @ApiProperty({
    example: 'USA',
    description: 'The answer text incase of MCQ or T/F',
    type: String,
  })
  @IsOptional()
  student_quiz_question_answer_txt: string;

  @ApiProperty({
    example: true,
    description: 'Weather the student answer is correct or not',
    type: Boolean,
  })
  @IsOptional()
  student_quiz_question_is_correct: boolean;
}
