import { PartialType } from '@nestjs/swagger';
import { CreateStudentQuizDto } from './create-student-quiz-dto';

export class UpdateStudentQuizDto extends PartialType(CreateStudentQuizDto) {}
