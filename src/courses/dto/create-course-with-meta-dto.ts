import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course-dto';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCourseWithMetaDto extends PartialType(CreateCourseDto) {
  @IsInt()
  @IsNotEmpty()
  metadata_group_name: string;

  @IsArray()
  @Type(() => Object)
  metadata: {
    key: string;
    value: any;
  }[];
}
