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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateLessonDto } from './dto/create-lesson-dto';
import { UpdateLessonDto } from './dto/update-lesson-dto';
import { LessonsService } from './lessons.service';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}
  /**
   *
   * LESSON
   * GET ALL LESSONS
   * GET ALL LESSONS' TITLES
   * GET ONE LESSON
   * SET LESSON
   * DELETE LESSON
   * UPDATE LESSON
   *
   */
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all lessons',
    type: [CreateLessonDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllLessons() {
    return this.lessonsService.getAllLessons();
  }

  @ApiOperation({ summary: 'Get all lessons titles' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all of the lessons titles',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all/titles')
  getAllLessonTitles() {
    return this.lessonsService.getAllLessonsTitles();
  }

  @ApiOperation({ summary: 'Get lesson by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected lesson',
  })
  @ApiResponse({
    status: 200,
    description: 'The selected lesson data',
    type: CreateLessonDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getLesson(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.getLesson(id);
  }

  @ApiOperation({ summary: 'Creat new lesson' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'CreateLessonDto',
    },
    description: 'The lesson data',
    type: CreateLessonDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The new lessons data',
    type: CreateLessonDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/new')
  createLesson(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.createLesson(createLessonDto);
  }

  @ApiOperation({ summary: 'Delete lesson' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected lesson',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted course data',
    type: CreateLessonDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  deleteLesson(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.deleteLesson(id);
  }

  @ApiOperation({ summary: 'Update lesson data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected lesson',
  })
  @ApiBody({
    schema: {
      type: 'CreateLessonDto',
    },
    description: 'The fields we want to update in the lesson',
    required: true,
    type: CreateLessonDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated lesson',
    type: CreateLessonDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put('/update/:id')
  updateLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.updateLesson(id, updateLessonDto);
  }
  /**
   *
   * LESSON - CLASS
   * GET LESSONS CLASS
   * SET LESSON'S CLASS
   *
   */
  @ApiOperation({ summary: 'Get the lesson classes' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected lesson',
  })
  @ApiResponse({
    status: 200,
    description: 'The lesson classes',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/class/:id')
  getLessonClass(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.getLessonClass(id);
  }

  @ApiOperation({ summary: 'Set the lesson class' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected lesosn',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        className: {
          type: 'string',
          example: '3A',
        },
      },
    },
    description: 'The class name',
    required: true,
    type: Object,
  })
  @ApiResponse({
    status: 200,
    description: 'The lesson meta data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/class/new/:id')
  setLessonClass(
    @Body('className') className: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.lessonsService.setLessonClass(id, className);
  }
  /**
   *
   * LESSON - META
   * GET LESSONS META
   * SET LESSON META
   * SET LESSON META LIST
   * GET LESSON META BY KEY
   *
   */
  @ApiOperation({ summary: 'Get all lesson meta data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected lesson',
  })
  @ApiResponse({
    status: 200,
    description: 'The meta data of the selected lesson',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/meta/:id')
  getLessonMeta(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.getLessonMeta(id);
  }

  @ApiOperation({ summary: 'Set lesson meta data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected lesson',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'The key of the meta data',
        },
        value: {
          type: 'string',
          description: 'The value of the meta data',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The added lesson meta data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/meta/new/:id')
  setLessonMeta(
    @Body('group_name') group_name: string,
    @Body('key') key: string,
    @Body('value') value: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.lessonsService.setLessonMeta(id, group_name, key, value);
  }

  @ApiOperation({ summary: "Set a list of lesson's metadata" })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected lesson id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        group_name: {
          type: 'string',
          example: 'Location',
          description: 'The group title',
        },
        metadata: {
          type: 'array',
          example: [
            {
              key: 'place',
              value: 'Egypt',
            },
          ],
          description: 'The list of metadata',
        },
      },
    },
    description: 'The meta group name, and the metadata itself',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of added metadata',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Post('/meta/new/list/:id')
  setLessonMetaList(
    @Param('id', ParseIntPipe) id: number,
    @Body('group_name') group_name: string,
    @Body('metadata') metadata: [key: any, value: any],
  ) {
    return this.lessonsService.setLessonMetaList(id, group_name, metadata);
  }

  @ApiOperation({ summary: 'Get lesson meta by key' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected lesson id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          example: 'location',
          description: 'The key of the metadata',
        },
      },
    },
    description: 'The key for the metadata',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The selected metadata',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/meta/key/:id')
  getLessonMetaByKey(
    @Param('id', ParseIntPipe) id: number,
    @Body('key') key: string,
  ) {
    return this.lessonsService.getLessonMetaByKey(id, key);
  }
  /**
   *
   * LESSON - INSTRUCTOR
   * GET LESSON'S INSTRUCTOR
   *
   */
  @ApiOperation({ summary: 'The lesson instructor' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected lesson id',
  })
  @ApiResponse({
    status: 200,
    description: 'The lesson instructor',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/instructor/:id')
  getLessonInstructor(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.getLessonInstructor(id);
  }
}
