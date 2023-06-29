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
import { CreateCourseDto } from 'src/courses/dto/create-course-dto';
import { User } from 'src/decorators/user.decorator';
import { CreateLessonDto } from 'src/lessons/dto/create-lesson-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { InstructorCourseStatus } from './enums/instructor-course-status.enum';
import { InstructorLessonStatus } from './enums/instructor-lesson-status.enum';
import { StudentCourseStatus } from './enums/student-course-status.enum';
import { StudentLessonStatus } from './enums/student-lesson-status.enum';
import { Student } from './guards/student.guard';
import { Teacher } from './guards/teacher.guard';
import { UsersService } from './users.service';
import { CreateStudentQuizDto } from './dto/create-student-quiz-dto';
import { UpdateStudentQuizDto } from './dto/update-student-quiz-dto';
import { CreateStudentQuizQuestionDto } from './dto/create-student-quiz-question-dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all of the users data',
    type: [CreateUserDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get all users names' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all of the users names',
    type: [String],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all/names')
  getAllUsersNames() {
    return this.usersService.getAllUserNames();
  }

  @ApiOperation({ summary: 'Get user by email address' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The selected user data',
    type: CreateUserDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'john@example.com',
        },
      },
    },
    description: 'The email address of the user',
    required: true,
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/email')
  getUserByEmail(@Body('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @ApiOperation({ summary: 'Get user by phone number' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The selected user data',
    type: CreateUserDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
          example: '(+20)1004411391',
        },
      },
    },
    description: 'The phone number of the user',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/phone')
  getUserByPhone(@Body('phone') phone: string) {
    return this.usersService.getUserByPhone(phone);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected user',
  })
  @ApiResponse({
    status: 200,
    description: 'The selected user data',
    type: CreateUserDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUser(id);
  }

  @ApiOperation({ summary: 'Get user type' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
  })
  @ApiResponse({
    status: 200,
    description: 'The user type',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/type/:id')
  getUserType(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserType(id);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The deleted user',
    type: CreateUserDto,
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected user',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @ApiOperation({ summary: 'Update user data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected user',
  })
  @ApiBody({
    schema: {
      type: 'CreateUserDto',
    },
    description: 'The fields that we need to update in the user',
    required: true,
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated user',
    type: CreateUserDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Adding nickname to user meta data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected user',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nickname: {
          type: 'string',
          example: 'ZODAIC',
        },
      },
    },
    description: 'The nickname for the user',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The user_meta data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('nickname/:id')
  setUserNickname(
    @Body('nickname') nickname: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.setUserNickname(nickname, id);
  }
  /**
   *
   *  USER - META
   *  GET USER META
   *  SET USER META
   *
   */
  @ApiOperation({ summary: 'Get all user meta data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected user',
  })
  @ApiResponse({
    status: 200,
    description: 'The meta data of the selected user',
    type: Array,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/meta/:id')
  getUserMeta(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserMeta(id);
  }

  @ApiOperation({ summary: 'Set user meta data' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
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
        value: {
          type: 'any',
          example: 'Egypt',
          description: 'The meta data value',
        },
      },
    },
    description: 'The meta data',
  })
  @ApiResponse({
    status: 200,
    description: 'The added meta data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('meta/new/:id')
  setUserMeta(
    @Body('key') key: string,
    @Body('value') value: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.setUserMeta(id, key, value);
  }
  /**
   *
   *  USER - ROLE
   *  GET USER ROLE
   *  SET USER ROLE
   *  DELETE USER ROLE
   *  UPDATE USER ROLE
   *
   */
  @ApiOperation({ summary: "Get the user's role" })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user role data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Get('role/:id')
  getUserRole(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserRole(id);
  }

  @ApiOperation({ summary: "Set user's role" })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roleId: {
          type: 'number',
          example: 3,
          description: 'The selected role id',
        },
      },
    },
    description: 'The role id',
  })
  @ApiResponse({
    status: 200,
    description: 'The user role data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('role/new/:id')
  setUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('roleId') roleId: number,
  ) {
    return this.usersService.setUserRole(id, roleId);
  }

  @ApiOperation({ summary: 'Delete user role' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected user',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted role data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('role/delete/:id')
  deleteUserRole(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUserRole(id);
  }

  @ApiOperation({ summary: 'Update the user role' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'intege',
    description: 'The id of the new role',
  })
  @ApiResponse({
    status: 200,
    description: 'The new user role data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Put('role/update/:id')
  updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('roleId') roleId: number,
  ) {
    return this.usersService.updateUserRole(id, roleId);
  }
  /**
   *
   *  STUDENT - COURSE
   *  GET ALL
   *  GET ONE
   *  SET ONE
   *  DELETE ONE
   *  UPDATE ONE STATUS
   *
   */
  @ApiOperation({ summary: 'Get all student courses' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected student',
  })
  @ApiResponse({
    status: 200,
    description: "List of the student's courses",
    type: [Object],
  })
  @UseGuards(JwtAuthGuard, Student)
  @Get('/course/:id')
  getStudentCourses(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getStudentCourses(id);
  }

  @ApiOperation({ summary: 'Get one student course' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selecte student',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        courseId: {
          type: 'number',
          example: 2,
          description: 'The id of the selected course',
        },
      },
    },
    description: 'The course id',
  })
  @ApiResponse({
    status: 200,
    description: 'The student course data',
  })
  @UseGuards(JwtAuthGuard, Student)
  @Post('course/one/:id')
  getStudentCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body('courseId') courseId: number,
  ) {
    return this.usersService.getStudentCourse(id, courseId);
  }

  @ApiOperation({ summary: 'Set a student course' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected student id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        courseId: {
          type: 'number',
          example: 3,
          description: 'The selected course id',
        },
        status: {
          type: 'StudentCourseStatus',
          example: StudentCourseStatus.DONE,
          description: 'The student status for the course',
        },
      },
    },
    description: 'The course data',
  })
  @ApiResponse({
    status: 200,
    description: 'The student course data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Student)
  @Post('/course/set/:id')
  setStudentCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body('courseId') courseId: number,
    @Body('status') status: StudentCourseStatus,
  ) {
    return this.usersService.setStudentCourse(id, courseId, status);
  }

  @ApiOperation({ summary: 'Delete the student course' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected student',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        courseId: {
          type: 'number',
          example: 2,
          description: 'The selected course id',
        },
      },
    },
    description: 'The course id',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted student course data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Student)
  @Delete('/course/delete/:id')
  deleteStudentCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body('courseId') courseId: number,
  ) {
    return this.usersService.deleteStudentCourse(id, courseId);
  }

  @ApiOperation({ summary: 'Update the student course status' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected student id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        courseId: {
          type: 'number',
          example: 3,
          description: 'The selected course id',
        },
        status: {
          type: 'StudentCourseStatus',
          example: StudentCourseStatus.DONE,
          description: 'The student status in the course',
        },
      },
    },
    description: 'The course id and the new status',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated student course data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Student)
  @Put('course/update/status/:id')
  updateStudentCourseStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('courseId') courseId: number,
    @Body('status') status: StudentCourseStatus,
  ) {
    return this.usersService.updateStudentCourseStatus(id, courseId, status);
  }
  /**
   *
   *  INSTRUCTOR - COURSE
   *  GET ALL
   *  GET ONE
   *  SET ONE
   *  DELETE ONE
   *  UPDATE ONE STATUS
   *
   */
  @ApiOperation({ summary: 'Get all instructor courses' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
  })
  @ApiResponse({
    status: 200,
    description: "List of all instructor's courses",
    type: [Array],
  })
  @UseGuards(JwtAuthGuard, Teacher)
  @Get('/course/instructor/:id')
  getInstructorCourses(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getInstructorCourses(id);
  }

  @ApiOperation({ summary: 'Get one instructor course' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        courseId: {
          type: 'number',
          example: 3,
          description: 'The selected course id',
        },
      },
    },
    description: 'The course id',
  })
  @ApiResponse({
    status: 200,
    description: 'The course data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Teacher)
  @Post('/course/instructor/one/:id')
  getInstructorCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body('courseId') courseId: number,
  ) {
    return this.usersService.getInstructorCourse(id, courseId);
  }

  @ApiOperation({ summary: 'Set a new instructor course' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
  })
  @ApiBody({
    schema: {
      type: 'CreateCourseDto',
    },
    description: 'The create course data',
    type: CreateCourseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The instructor course data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Teacher)
  @Post('/course/instructor/set/:id')
  setInstructorCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.usersService.setInstructorCourse(id, createCourseDto);
  }

  @ApiOperation({ summary: 'Delet instructor course' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, Teacher)
  @Delete('/course/instructor/delete/:id')
  deleteInstructorCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body('courseId') courseId: number,
  ) {
    return this.usersService.deleteInstructorCourse(id, courseId);
  }

  @ApiOperation({ summary: 'Update the instructor course status' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The selected user id',
    example: 3,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        courseId: {
          type: 'number',
          example: 2,
          description: 'The selected course id',
        },
        status: {
          type: 'InstructorCourseStatus',
          example: InstructorCourseStatus.DONE,
          description: 'The new course status',
        },
      },
    },
    description: 'The course id and new status',
  })
  @ApiResponse({
    status: 200,
    description: 'The new course status',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Teacher)
  @Put('/course/instructor/update/status/:id')
  updateInstructorCourseStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('courseId') courseId: number,
    @Body('status') status: InstructorCourseStatus,
  ) {
    return this.usersService.updateInstructorCourseStatus(id, courseId, status);
  }
  /**
   *
   *  STUDENT - LESSON
   *  GET ALL
   *  GET ONE
   *  SET ONE
   *  DELETE ONE
   *  UPDATE ONE STATUS
   *
   */
  @ApiOperation({ summary: "Get all student's lessons" })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user list of lessons',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard, Student)
  @Get('/lesson/:id')
  getUserLessons(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getStudentLessons(id);
  }

  @ApiOperation({ summary: 'Get one student course' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lessonId: {
          type: 'number',
          example: 2,
          description: 'The selected lesson id',
        },
      },
    },
    description: 'The lesson id',
  })
  @ApiResponse({
    status: 200,
    description: 'Selected lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Student)
  @Post('/lesson/one/:id')
  getUserLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body('lessonId') lessonId: number,
  ) {
    return this.usersService.getStudentLesson(id, lessonId);
  }

  @ApiOperation({ summary: "Set student's lesson" })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected user',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lessonId: {
          type: 'number',
          example: 2,
          description: 'The selected lesson id',
        },
        status: {
          type: 'StudentLessonStatus',
          example: StudentLessonStatus.DONE,
          description: 'The user status for the course',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The user and lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Student)
  @Post('/lesson/set/:id')
  setUserLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body('lessonId') lessonId: number,
    @Body('status') status: StudentLessonStatus,
  ) {
    return this.usersService.setStudentLesson(id, lessonId, status);
  }

  @ApiOperation({ summary: 'Delete student lesson' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
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
    description: 'The lesson id',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Student)
  @Delete('/lesson/delete/:id')
  deleteStudentLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body('lessonId') lessonId: number,
  ) {
    return this.usersService.deleteStudentLesson(id, lessonId);
  }

  @ApiOperation({ summary: 'Update student lesson status' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lessonId: {
          type: 'number',
          example: 1,
          description: 'The selected lesson id',
        },
        status: {
          type: 'StudentLessonStatus',
          example: StudentLessonStatus.DONE,
          description: 'The new lesson status',
        },
      },
    },
    description: 'The lesson id and the new status',
  })
  @ApiResponse({
    status: 200,
    description: 'The new student lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Student)
  @Put('lesson/update/status/:id')
  updateStudentLessonStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('lessonId') lessonId: number,
    @Body('status') status: StudentLessonStatus,
  ) {
    return this.usersService.updateStudentLessonStatus(id, lessonId, status);
  }
  /**
   *
   *  INSTRUCTOR - LESSON
   *  GET ALL
   *  GET ONE
   *  SET ONE
   *  DELETE ONE
   *  UPDATE ONE STATUS
   *
   */

  @ApiOperation({ summary: 'Get all instructor lessons' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
  })
  @ApiResponse({
    status: 200,
    description: 'The user lessons',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard, Teacher)
  @Get('/lesson/instructor/:id')
  getInstructorLessons(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getInstructorLessons(id);
  }

  @ApiOperation({ summary: 'Get one instructor lesson' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
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
    description: 'The lesson id',
  })
  @ApiResponse({
    status: 200,
    description: 'The lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Teacher)
  @Post('/lesson/instructor/one/:id')
  getInstructorLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body('lessonId') lessonId: number,
  ) {
    return this.usersService.getInstructorLesson(id, lessonId);
  }

  @ApiOperation({ summary: 'Set new instructor lesson' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
  })
  @ApiBody({
    schema: {
      type: 'CreateLessonDto',
    },
    description: 'The lesson data',
    type: CreateLessonDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The instructor lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/lesson/instructor/set/:id')
  setInstructorLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body() CreateLessonDto: CreateLessonDto,
  ) {
    return this.usersService.setInstructorLesson(id, CreateLessonDto);
  }

  @ApiOperation({ summary: 'Delete instructor lesson' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lessonId: {
          type: 'number',
          example: 2,
          description: 'The selected lesson id',
        },
      },
    },
    description: 'The lesson id',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted instructor lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Teacher)
  @Delete('/lesson/instructor/delete/:id')
  deleteInstructorLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body('lessonId') lessonId: number,
  ) {
    return this.usersService.deleteInstructorLesson(id, lessonId);
  }

  @ApiOperation({ summary: 'Update instructor lesson status' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The selected user id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lessonId: {
          type: 'number',
          example: 2,
          description: 'The selected lesson id',
        },
        status: {
          type: 'InstructorLessonStatus',
          example: InstructorCourseStatus.DONE,
          description: 'The new lesson status',
        },
      },
    },
    description: 'The lesson id and the new status',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated instructor lesson data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard, Teacher)
  @Put('/lesson/instructor/update/status/:id')
  updateInstructorLessonStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('lesosnId') lessonId: number,
    @Body('status') status: InstructorLessonStatus,
  ) {
    return this.usersService.updateInstructorLessonStatus(id, lessonId, status);
  }
  /**
   *
   *  STUDENT - QUIZ
   *  GET ALL
   *  GET ONE
   *  SET ONE
   *  DELETE ONE
   *  UPDATE ONE
   *
   */
  @ApiOperation({ summary: "Get all student's quizzes" })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected user id',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all student quizzes',
    type: [CreateStudentQuizDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/quizzes/all/:id')
  getStudentQuizzes(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getStudentQuizzes(id);
  }

  @ApiOperation({ summary: 'Get one student quiz' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected user id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quizId: {
          type: 'integer',
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
    description: 'The selected student quiz data',
    type: CreateStudentQuizDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/quizzes/one/:id')
  getStudentQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body('quizId') quizId: number,
  ) {
    return this.usersService.getStudentQuiz(id, quizId);
  }

  @ApiOperation({ summary: 'Set student quiz' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'CreateStudentQuizDto',
    },
    description: 'The student quiz data',
    required: true,
    type: CreateStudentQuizDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The student quiz data',
    type: CreateStudentQuizDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/quizzes/set')
  setStudentQuiz(@Body() createStudentQuizDto: CreateStudentQuizDto) {
    return this.usersService.setStudentQuiz(createStudentQuizDto);
  }

  @ApiOperation({ summary: 'Delete student quiz' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected user id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quizId: {
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
    description: 'The deleted student quiz data',
    type: CreateStudentQuizDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/quizzes/delete/:id')
  deleteStudentQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body('quizId') quizId: number,
  ) {
    return this.usersService.deleteStudentQuiz(id, quizId);
  }

  @ApiOperation({ summary: 'Update the student quiz' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected user id',
  })
  @ApiBody({
    schema: {
      type: 'UpdateStudentQuizDto',
    },
    description: 'The fields we want to update in the student quiz data',
    required: true,
    type: UpdateStudentQuizDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated studen quiz data',
    type: CreateStudentQuizDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put('/quizzes/update/:id')
  updateStudentQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentQuizDto: UpdateStudentQuizDto,
  ) {
    return this.usersService.updateStudentQuiz(id, updateStudentQuizDto);
  }
  /**
   *
   *  STUDENT - QUIZ - QUESTION
   *  GET ALL
   *  GET ONE
   *  SET ONE
   *  DELETE ONE
   *  UPDATE ONE
   *
   */
  @ApiOperation({ summary: 'Get all student quiz question answers' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'number',
    example: 2,
    description: 'The selected student quiz id',
  })
  @ApiResponse({
    status: 200,
    description:
      'The student quiz question answers data along with the question data',
    type: [Object],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/quizzes/questions/all/:id')
  getStudentQuizQuestions(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getStudentQuizQuestions(id);
  }

  @ApiOperation({ summary: 'GEt one student quiz question answer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected student quiz id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        question_id: {
          type: 'number',
          example: 4,
          description: 'The selected question id',
        },
      },
    },
    description: 'The question id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The student quiz question answer data',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/quizzes/questions/one/:id')
  getStudentQuizQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body('question_id') question_id: number,
  ) {
    return this.usersService.getStudentQuizQuestion(id, question_id);
  }

  @ApiOperation({ summary: 'Set student quiz question answer' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'CreateStudentQuizQuestionDto',
    },
    description: 'The student quiz question data',
    required: true,
    type: CreateStudentQuizQuestionDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The student quiz question data',
    type: CreateStudentQuizQuestionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/quizzes/questions/new/')
  setStudentQuizQuestion(
    @Body() createStudentQuizQuestionDto: CreateStudentQuizQuestionDto,
  ) {
    return this.usersService.setStudentQuizQuestion(
      createStudentQuizQuestionDto,
    );
  }

  @ApiOperation({ summary: 'Delete Student quiz question answer' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    example: 2,
    description: 'The selected student quiz id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        question_id: {
          type: 'number',
          example: 4,
          description: 'The selected question id',
        },
      },
    },
    description: 'The question id',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted student quiz question data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/quizzes/questions/delete/:id')
  deleteStudentQuizQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body('question_id') question_id: number,
  ) {
    return this.usersService.deleteStudentQuizQuestion(id, question_id);
  }
}
