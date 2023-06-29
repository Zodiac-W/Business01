import { PartialType } from '@nestjs/swagger';
import { CreateAnswerDto } from './create-answr-dto';

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {}
