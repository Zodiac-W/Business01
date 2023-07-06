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
import { CreateCourseWithMetaDto } from './dto/create-course-with-meta-dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}
  /**
   *
   *  COURSE
   *  GET ALL COURSES
   *  GET ALL COURSES' TITLES
   *  GET ONE COURSE
   *  SET COURSE
   *  DELETE COURSE
   *  UPDATE COURSE
   *
   */
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
  /**
   *
   * COURSE
   * CREATE COURSE WITH METADATA
   *
   */
  @ApiOperation({ summary: 'Create a new course with its metadata' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'CreateCourseWithMetaDto',
    },
    description: 'The new course data and metadata',
    required: true,
    type: CreateCourseWithMetaDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The new course data',
    type: CreateCourseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/complete/new')
  setCourseWithMeta(@Body() createCourseWithMetaDto: CreateCourseWithMetaDto) {
    return this.coursesService.setCourseWithMeta(createCourseWithMetaDto);
  }
  /**
   *
   *  COURSE
   *  GET COURSE ROUNDS
   *  SET COURSE ROUNDS
   *
   */
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
  /**
   *
   *  COURSE
   *  GET COURSE META
   *  SET COURSE META
   *
   */
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
    @Body('group_name') group_name: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.coursesService.setCourseMeta(id, group_name, key, value);
  }

  @ApiOperation({ summary: 'Get course meta by key' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          example: 'place',
          description: 'The meta data key',
        },
      },
    },
    description: 'The meta key',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The selected meta data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('meta/key/:id')
  getCourseMetaByKey(
    @Param('id', ParseIntPipe) id: number,
    @Body('key') key: string,
  ) {
    return this.coursesService.getCourseMetaByKey(id, key);
  }
  /**
   *
   * COURSE - LESSON
   * GET ALL COURSE LESSONS
   * GET ONE COURSE LESSON
   * SET COURSE LESSON
   * CREATE NEW LESSON AND SET IT TO COURSE
   * DELETE COURSE LESSON
   * UPDATE COURSE LESSON
   *
   */
  @ApiOperation({ summary: "Get all course's lessons" })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiResponse({
    status: 200,
    description: "List of course's lessons",
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/lessons/all/:id')
  getCourseLessons(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourseLessons(id);
  }

  @ApiOperation({ summary: 'Get one course lesson' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lesson_id: {
          type: 'number',
          example: 4,
          description: 'The selected lesson id',
        },
      },
    },
    description: 'The lesson id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "The course lesson's data",
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/lesson/one/:id')
  getCourseLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body('lesson_id') lesson_id: number,
  ) {
    return this.coursesService.getCourseLesson(id, lesson_id);
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

  @ApiOperation({ summary: 'Delete course lesson' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lesson_id: {
          type: 'number',
          example: 4,
          description: 'The selected lesson id',
        },
      },
    },
    description: 'The lesson id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted course lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/lessons/delete/:id')
  deleteCourseLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body('lesson_id') lesson_id: number,
  ) {
    return this.coursesService.deleteCourseLesson(id, lesson_id);
  }

  @ApiOperation({ summary: 'Update course lesson' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lesson_id_old: {
          type: 'number',
          example: 4,
          description: 'The old lesson id',
        },
        lesson_id_new: {
          type: 'name',
          example: 6,
          description: 'The new lesson id',
        },
      },
    },
    description: 'The old & new lessons ids',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The new course lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Put('lessons/update/:id')
  updateCourseLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body('lesson_id_old') lesson_id_old: number,
    @Body('lesson_id_new') lesson_id_new: number,
  ) {
    return this.coursesService.updateCourseLesson(
      id,
      lesson_id_old,
      lesson_id_new,
    );
  }
  /**
   *
   *  COURSE
   *  GET COURSE'S INSTRUCTOR
   *
   */
  @ApiOperation({ summary: "Get the course's instructor" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/instructor/:id')
  getCourseInstructor(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourseInstructor(id);
  }
  /**
   *
   * COURSE - QUIZ
   * GET ALL COURSE QUIZZES
   * GET ONE COURSE QUIZ
   * SET COURSE QUIZ
   * DELETE COURSE QUIZ
   * UPDATE COURSE QUIZ
   *
   */

  @ApiOperation({ summary: 'Get all course quizzes' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all course quizzes',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/quizzes/all/:id')
  getCourseQuizzes(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourseQuizzes(id);
  }

  @ApiOperation({ summary: 'Get one course quiz' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quiz_id: {
          type: 'number',
          example: 4,
          description: 'The selected quiz id',
        },
      },
    },
    description: 'The quiz id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The course quiz data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/quizzes/one/:id')
  getCourseQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body('quiz_id') quiz_id: number,
  ) {
    return this.coursesService.getCourseQuiz(id, quiz_id);
  }

  @ApiOperation({ summary: 'Set course quiz' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quiz_id: {
          type: 'number',
          example: 4,
          description: 'The selected quiz id',
        },
      },
    },
    description: 'The quiz id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The new course quiz data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/quizzes/new/:id')
  setCourseQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body('quiz_id') quiz_id: number,
  ) {
    return this.coursesService.setCourseQuiz(id, quiz_id);
  }

  @ApiOperation({ summary: 'Delete course quiz' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quiz_id: {
          type: 'number',
          example: 4,
          description: 'The selected quiz id',
        },
      },
    },
    description: 'The quiz id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted course quiz data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/quizzes/delete/:id')
  deleteCourseQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body('quiz_id') quiz_id: number,
  ) {
    return this.coursesService.deleteCourseQuiz(id, quiz_id);
  }

  @ApiOperation({ summary: 'Update course quiz' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quiz_id_old: {
          type: 'number',
          example: 4,
          description: 'The old quiz id',
        },
        quiz_id_new: {
          type: 'number',
          example: 6,
          description: 'The new quiz id',
        },
      },
    },
    description: 'The old & new quizzes ids',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated course quiz data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Put('/quizzes/update/:id')
  updateCourseQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body('quiz_id_old') quiz_id_old: number,
    @Body('quiz_id_new') quiz_id_new: number,
  ) {
    return this.coursesService.updateCourseQuiz(id, quiz_id_old, quiz_id_new);
  }
  /**
   *
   * COURSE - DISCUSSION
   * GET ALL COURSE DISCUSSIONS
   * GET ONE COURSE DISCUSSION
   * SET COURSE DISCUSSION
   * DELETE COURSE DISCUSSION
   * UPDATE COURSE DISCUSSION
   *
   */
  @ApiOperation({ summary: 'Get all course discussions' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiResponse({
    status: 200,
    description: 'The selected course discussions data',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/discussions/all/:id')
  getCourseDiscusions(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourseDiscusions(id);
  }

  @ApiOperation({ summary: 'Get one course discussion' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        discusion_id: {
          type: 'number',
          example: 4,
          description: 'The selected discussion id',
        },
      },
    },
    description: 'The discussion id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The selected course discussion data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/discussions/one/:id')
  getCourseDiscusion(
    @Param('id', ParseIntPipe) id: number,
    @Body('discusion_id') discusion_id: number,
  ) {
    return this.coursesService.getCourseDiscusion(id, discusion_id);
  }

  @ApiOperation({ summary: 'Set new course discussion' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        disucsion_id: {
          type: 'number',
          example: 4,
          description: 'The selected discussion id',
        },
      },
    },
    description: 'The discussion id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The new course discussion data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/discussions/new/:id')
  setCourseDiscusion(
    @Param('id', ParseIntPipe) id: number,
    @Body('disucsion_id') disucsion_id: number,
  ) {
    return this.coursesService.setCourseDiscusion(id, disucsion_id);
  }

  @ApiOperation({ summary: 'Delete course discussion' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course is',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        discusion_id: {
          type: 'number',
          example: 4,
          description: 'The selected discussion id',
        },
      },
    },
    description: 'The discussion id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted course discussion data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/discussions/delete/:id')
  deleteCourseDiscusion(
    @Param('id', ParseIntPipe) id: number,
    @Body('discusion_id') discusion_id: number,
  ) {
    return this.coursesService.deleteCourseDiscusion(id, discusion_id);
  }

  @ApiOperation({ summary: 'Update course discussion' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected course id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        discusion_id_old: {
          type: 'number',
          example: 4,
          description: 'The old discussion id',
        },
        discusion_id_new: {
          type: 'number',
          example: 6,
          description: 'The new discussion id',
        },
      },
    },
    description: 'The old & new discussions ids',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated course discussion',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Put('/discussions/update/:id')
  updateCourseDiscusion(
    @Param('id', ParseIntPipe) id: number,
    @Body('discusion_id_old') discusion_id_old: number,
    @Body('discusion_id_new') discusion_id_new: number,
  ) {
    return this.coursesService.updateCourseDiscusion(
      id,
      discusion_id_old,
      discusion_id_new,
    );
  }
}
