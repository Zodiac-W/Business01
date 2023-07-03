import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DiscusionService } from './discusion.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateDiscusionDto } from './dto/create-discusion-dto';
import { UpdateDiscusionDto } from './dto/update-discusion-dto';

@ApiTags('Discussions')
@Controller('discusion')
export class DiscusionController {
  constructor(private discusionService: DiscusionService) {}
  /**
   *
   * Discussion
   * GET ALL
   * GET ONE
   * SET DISCUSSION
   * DELETE DISCUSSION
   * UPDATE DISCUSSION
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

  @ApiOperation({ summary: 'Get one discussion' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected disucssion id',
  })
  @ApiResponse({
    status: 200,
    description: 'The selected discussion data',
    type: CreateDiscusionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/one/:id')
  getDiscusion(@Param('id', ParseIntPipe) id: number) {
    return this.discusionService.getDiscusion(id);
  }

  @ApiOperation({ summary: 'Set new discussion' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'CreateDiscusionDto',
    },
    description: 'The new discusion data',
    required: true,
    type: CreateDiscusionDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The new discusion data',
    type: CreateDiscusionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/new')
  setDiscusion(@Body() createDiscusionDto: CreateDiscusionDto) {
    return this.discusionService.setDiscusion(createDiscusionDto);
  }

  @ApiOperation({ summary: 'Delete discussion' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected discussion id',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  deleteDiscusion(@Param('id', ParseIntPipe) id: number) {
    return this.discusionService.deleteDiscusion(id);
  }

  @ApiOperation({ summary: 'Update discussion' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected discussion id',
  })
  @ApiBody({
    schema: {
      type: 'UpdateDiscusionDto',
    },
    description: 'The updated field of the discussion',
    required: true,
    type: UpdateDiscusionDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated discussion data',
    type: UpdateDiscusionDto,
  })
  @UseGuards()
  @Put('/update/:id')
  updateDiscusion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiscusionDto: UpdateDiscusionDto,
  ) {
    return this.discusionService.updateDiscusion(id, updateDiscusionDto);
  }
}
