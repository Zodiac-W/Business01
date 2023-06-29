import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({
    example: 'USA',
    description: 'The answer txt',
    type: String,
  })
  @IsNotEmpty()
  answer_txt: string;

  @ApiProperty({
    example: true,
    description: 'Sets weather this answer is correct or not',
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  answer_is_correct: boolean;

  @IsNotEmpty()
  @IsNumber()
  question_id: number;
}
