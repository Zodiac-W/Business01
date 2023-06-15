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

  async createRole(createRoleDto: CreateRoleDto): Promise<any> {
    const { role_title, role_description } = createRoleDto;

    const role = new Role();
    role.role_title = role_title;
    role.role_description = role_description;

    await this.roleRepository.save(role);
    return role;
  }

  async getAllRoles(): Promise<any> {
    const roles = await this.roleRepository.find();
    return roles;
  }

  async getAllRolesTitles(): Promise<any> {
    const names = await this.roleRepository.find({ select: ['role_title'] });

    const roleNames = names.map((name) => {
      return { role_name: name };
    });
    return roleNames;
  }

  async getRole(id: number): Promise<any> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw Error('Role does not exist');
    }
    return role;
  }

  async deleteRole(id: number): Promise<any> {
    const role = await this.getRole(id);

    await this.roleRepository.softDelete(id);
    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<any> {
    let role = await this.getRole(id);

    role = { ...role, ...updateRoleDto };
    await this.roleRepository.save(role);
    return role;
  }
}
