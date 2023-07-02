import { Controller, Get, UseGuards } from '@nestjs/common';
import { DiscusionService } from './discusion.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateDiscusionDto } from './dto/create-discusion-dto';

@ApiTags('Discussions')
@Controller('discusion')
export class DiscusionController {
  constructor(private discusionService: DiscusionService) {}
  /**
   *
   * Discussion
   * GET ALL
   * GET ONE
   * SET STUDENT QUIZ
   * DELETE STUDENT QUIZ
   *
   */
  @ApiOperation({ summary: 'Get all discussions' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all discussions',
    type: [CreateDiscusionDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/all')
  getDiscusions() {
    return this.discusionService.getDiscusions();
  }
}
