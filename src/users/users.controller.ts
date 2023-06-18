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
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { InstructorCourseStatus } from './enums/instructor-course-status.enum';
import { StudentCourseStatus } from './enums/student-course-status.enum';
import { UserLessonStatus } from './enums/user-lesson-status.enum';
import { Student } from './guards/student.guard';
import { Teacher } from './guards/teacher.guard';
import { UsersService } from './users.service';

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
    type: String,
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
    type: String,
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

  @Post('meta/new/:id')
  setUserMeta(
    @Body('key') key: string,
    @Body('value') value: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.setUserMeta(id, key, value);
  }

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
    type: Object,
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

  @ApiOperation({ summary: "Get users's lessons" })
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
  @UseGuards(JwtAuthGuard)
  @Get('/lesson/:id')
  getUserLesson(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserLesson(id);
  }

  @ApiOperation({ summary: "Set user's lesson" })
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
          type: 'UserLessonStatus',
          example: 'Done',
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
  @UseGuards(JwtAuthGuard)
  @Post('/lesson/set/:id')
  setUserLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body('lessonId') lessonId: number,
    @Body('status') status: UserLessonStatus,
  ) {
    return this.usersService.setUserLesson(id, lessonId, status);
  }

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
    type: Object,
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
    type: Object,
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
    type: Object,
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
    type: Object,
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
    type: Object,
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
  @UseGuards(JwtAuthGuard, Teacher)
  @Put('/course/instructor/update/status/:id')
  updateInstructorCourseStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('courseId') courseId: number,
    @Body('status') status: InstructorCourseStatus,
  ) {
    return this.usersService.updateInstructorCourseStatus(id, courseId, status);
  }
}
