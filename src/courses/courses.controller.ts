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
import { CreateLessonDto } from 'src/lessons/dto/create-lesson-dto';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course-dto';
import { UpdateCourseDto } from './dto/update-course-dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @ApiOperation({ summary: 'Get all courses' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all of the courses',
    type: [CreateCourseDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @ApiOperation({ summary: 'Get all courses titles' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all of the courses titles',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all/titles')
  getAllCourseTitles() {
    return this.coursesService.getAllCoursesTitles();
  }

  @ApiOperation({ summary: 'Get course by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected course',
  })
  @ApiResponse({
    status: 200,
    description: 'The selected course data',
    type: CreateCourseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getCourse(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourse(id);
  }

  @ApiOperation({ summary: 'Create new course' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'CreateCourseDto',
    },
    description: 'The course data',
    required: true,
    type: CreateCourseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The new course data',
    type: CreateCourseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/new')
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @ApiOperation({ summary: 'Delete course' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected course',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted course data',
    type: CreateCourseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  deleteCourse(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.deleteCourse(id);
  }

  @ApiOperation({ summary: 'Update course data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected course',
  })
  @ApiBody({
    schema: {
      type: 'CreateCourseDto',
    },
    description: 'The fields we want to update in the course',
    required: true,
    type: CreateCourseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated course',
    type: CreateCourseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  @ApiOperation({ summary: 'Get total course rounds' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected course',
  })
  @ApiResponse({
    status: 200,
    description: 'The number of course rounds',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/rounds/:id')
  getCourseRounds(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourseRounds(id);
  }

  @ApiOperation({
    summary:
      'Add new course rounds, we either set the number of rounds by sending value for rounds, or increment the current rounds by just sending a request without any rounds',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected course',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        round: {
          type: 'number',
          example: 5,
        },
      },
    },
    description: 'The number of course rounds',
    required: false,
    type: Object,
  })
  @ApiResponse({
    status: 200,
    description: 'The new course rounds',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/rounds/new/:id')
  setCourseRounds(
    @Body('round') round: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.coursesService.setCourseRounds(id, round);
  }

  @ApiOperation({ summary: 'Get all course meta data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected course',
  })
  @ApiResponse({
    status: 200,
    description: 'The meta data for the selected course',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/meta/:id')
  getCourseMeta(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourseMeta(id);
  }

  @ApiOperation({ summary: 'Set course meta data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected course',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'The key for the meta value',
        },
        value: {
          type: 'any',
          description: 'The value for the meta key',
        },
      },
    },
    description: 'New meta value for the selected course',
    required: true,
    type: Object,
  })
  @ApiResponse({
    status: 200,
    description: 'The added course meta',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('meta/new/:id')
  setCourseMeta(
    @Body('key') key: string,
    @Body('value') value: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.coursesService.setCourseMeta(id, key, value);
  }

  @ApiOperation({ summary: "Get course's lessons" })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected course',
  })
  @ApiResponse({
    status: 200,
    description: "The course list of lessons' data",
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/lesson/:id')
  getCourseLesson(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourseLesson(id);
  }

  @ApiOperation({ summary: 'Set course lesson' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected course',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lessonId: {
          type: 'number',
          example: 3,
          description: 'The selected lesson id',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The course and lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/lesson/set/:id')
  setCourseLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body('lessonId') lessonId: number,
  ) {
    return this.coursesService.setCourseLesson(id, lessonId);
  }

  @ApiOperation({ summary: 'Create new lesson for the course' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected course',
  })
  @ApiBody({
    schema: {
      type: 'CreateLessonDto',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The course and the lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/lesson/new/:id')
  createCourseLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.coursesService.createCourseLesson(id, createLessonDto);
  }
}
