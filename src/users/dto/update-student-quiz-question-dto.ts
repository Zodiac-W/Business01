import { PartialType } from '@nestjs/swagger';
import { CreateStudentQuizQuestionDto } from './create-student-quiz-question-dto';

export class UpdateStudentQuizQuestionDto extends PartialType(
  CreateStudentQuizQuestionDto,
) {}
