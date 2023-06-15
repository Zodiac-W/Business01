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
import { CreateRoleDto } from './dto/create-role-dto';
import { UpdateRoleDto } from './dto/update-role-dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: 'Get all roles' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all roles',
    type: [CreateRoleDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllRoles() {
    return this.roleService.getAllRoles();
  }
  @ApiOperation({ summary: 'Ge all role titles' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all roles tiltes',
    type: Array,
  })
  @UseGuards(JwtAuthGuard)
  @Get('all/title')
  getAllRolesTitles() {
    return this.roleService.getAllRolesTitles();
  }

  @ApiOperation({ summary: 'Get role by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected role',
  })
  @ApiResponse({
    status: 200,
    description: 'The selected role data',
    type: CreateRoleDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getRole(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.getRole(id);
  }

  @ApiOperation({ summary: 'Create new role' })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'CreateRoleDto',
    },
    description: 'The role data',
    required: true,
    type: CreateRoleDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The new role data',
    type: CreateRoleDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/new')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @ApiOperation({ summary: 'Delete role' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected role',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted role data',
    type: CreateRoleDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:id')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.deleteRole(id);
  }

  @ApiOperation({ summary: 'Update role data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The id of the selected role',
  })
  @ApiBody({
    schema: {
      type: 'CreateRoleDto',
    },
    description: 'The fields we want to update in the role',
    required: true,
    type: CreateRoleDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated role',
    type: CreateRoleDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put('/update/:id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }
}
