import { PartialType } from '@nestjs/swagger';
import { CreateDiscusionDto } from './create-discusion-dto';

export class UpdateDiscusionDto extends PartialType(CreateDiscusionDto) {}
