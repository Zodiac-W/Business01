import { PartialType } from '@nestjs/swagger';
import { CreateCommentReplayDto } from './create-comment-replay-dto';

export class UpdateCommentReplayDto extends PartialType(
  CreateCommentReplayDto,
) {}
