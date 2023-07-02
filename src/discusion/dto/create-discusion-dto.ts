import { ApiProperty } from '@nestjs/swagger';
import { DiscusionStatus } from '../enum/discusion-status.enum';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDiscusionDto {
  @ApiProperty({
    example: 'How can we do something in the course?',
    description: 'The question of the discussion',
    type: String,
  })
  @IsNotEmpty()
  discusion_txt: string;

  @ApiProperty({
    example: DiscusionStatus.OPEN,
    description: 'The status of the discussion',
    enum: DiscusionStatus,
  })
  @IsOptional()
  @IsEnum(DiscusionStatus)
  discusion_status: DiscusionStatus;
}
