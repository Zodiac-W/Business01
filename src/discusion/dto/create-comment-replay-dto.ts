import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentReplayDto {
  @ApiProperty({
    example: 'This is comment replay',
    description: 'The user replay to a comment',
    type: String,
  })
  @IsNotEmpty()
  comment_replay_txt: string;

  @ApiProperty({
    example: 2,
    description: 'The replay user id',
    type: Number,
  })
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    example: 4,
    description: 'The comment on which we replay id',
    type: Number,
  })
  @IsNotEmpty()
  comment_id: number;
}
