import { Module } from '@nestjs/common';
import { DiscusionController } from './discusion.controller';
import { DiscusionService } from './discusion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discusion } from './entities/discusion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discusion])],
  controllers: [DiscusionController],
  providers: [DiscusionService],
  exports: [DiscusionService],
})
export class DiscusionModule {}
