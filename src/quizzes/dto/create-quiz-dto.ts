import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({
    example: 'Quiz #1',
    description: 'The title of the quiz',
    type: String,
  })
  @IsNotEmpty()
  quiz_title: string;

  @ApiProperty({
    example: 'The quiz will evaluate you for...',
    description: 'The description of the quiz',
    type: String,
  })
  @IsOptional()
  quiz_description: string;

  @ApiProperty({
    example: 50,
    description: 'The score student must score to pass the quiz',
    type: Number,
  })
  @IsNotEmpty()
  quiz_passing_score: number;
}
