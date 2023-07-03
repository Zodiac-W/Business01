import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role-dto';
import { UpdateRoleDto } from './dto/update-role-dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  /**
   *
   * ROLE
   * SET NEW ROLE
   * GET ALL ROLES
   * GET ALL ROLES TITLES
   * GET ONE ROLE
   * DELETE ROLE
   * UPDATE ROLE
   *
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<any> {
    try {
      const { role_title, role_description } = createRoleDto;

      const titles = await this.getAllRolesTitles();
      const exist = titles.find((title) => {
        return title.role_name.role_title === role_title;
      });

      if (exist) {
        return { message: 'This role already exists' };
      }

      const role = new Role();
      role.role_title = role_title;
      role.role_description = role_description;

      await this.roleRepository.save(role);
      return role;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getAllRoles(): Promise<any> {
    try {
      const roles = await this.roleRepository.find();

      if (roles.length < 1) {
        return { message: 'There is not roles yet' };
      }

      return roles;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getAllRolesTitles(): Promise<any> {
    try {
      const names = await this.roleRepository.find({ select: ['role_title'] });

      const roleNames = names.map((name) => {
        return { role_name: name };
      });
      return roleNames;
    } catch (err) {
      return { message: err.message };
    }
  }

  async getRole(id: number): Promise<any> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });
      if (!role) {
        throw Error('Role does not exist');
      }
      return role;
    } catch (err) {
      return { message: err.message };
    }
  }

  async deleteRole(id: number): Promise<any> {
    const role = await this.getRole(id);
    if (role.message) {
      return role;
    }
    await this.roleRepository.softDelete(id);
    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<any> {
    let role = await this.getRole(id);
    if (role.message) {
      return role;
    }
    role = { ...role, ...updateRoleDto };
    await this.roleRepository.save(role);
    return role;
  }
}
