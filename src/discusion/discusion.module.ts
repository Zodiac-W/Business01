import { Module } from '@nestjs/common';
import { DiscusionController } from './discusion.controller';
import { DiscusionService } from './discusion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discusion } from './entities/discusion.entity';
import { Comment } from './entities/comment.entity';
import { Comment_replay } from './entities/comment-replay.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discusion, Comment, Comment_replay])],
  controllers: [DiscusionController],
  providers: [DiscusionService],
  exports: [DiscusionService],
})
export class DiscusionModule {}
