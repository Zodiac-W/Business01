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
import { User } from 'src/decorators/user.decorator';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
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

  @ApiOperation({ summary: 'Get all course meta data' })
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
    description: 'The id of the selected role',
  })
  @ApiResponse({
    status: 200,
    description: 'The user role data',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('role/new/:id')
  setUserRole(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    return this.usersService.setUserRole(user.userId, id);
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
  updateUserRole(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    return this.usersService.updateUserRole(user.userId, id);
  }
}
