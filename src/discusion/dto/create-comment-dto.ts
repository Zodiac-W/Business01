import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This problem is solved with this solution',
    description: 'comment on a discussion',
    type: String,
  })
  @IsNotEmpty()
  comment_txt: string;

  @ApiProperty({
    example: 2,
    description: 'The comment user id',
    type: Number,
  })
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    example: 4,
    description: 'The discussion id',
    type: Number,
  })
  @IsNotEmpty()
  discusion_id: number;
}
