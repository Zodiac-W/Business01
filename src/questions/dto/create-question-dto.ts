import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { QuestionType } from '../enums/question-type.enum';

export class CreateQuestionDto {
  @ApiProperty({
    example: 'What is the location of USA',
    description: 'The question text',
    type: String,
  })
  @IsNotEmpty()
  question_txt: string;

  @ApiProperty({
    example: QuestionType.MCQ,
    description: 'The type of the question',
    enum: QuestionType,
  })
  @IsEnum(QuestionType)
  question_type: QuestionType;

  @ApiProperty({
    example: 4,
    description: 'The score points for this question',
    type: Number,
  })
  @IsNotEmpty()
  question_score: number;
}
