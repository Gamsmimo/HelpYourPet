import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';

@Injectable()
export class RoleSeed {
  constructor(
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
  ) {}

  async createRoles() {
    // Verificar si ya existen roles
    const existingRoles = await this.rolesRepository.count();
    if (existingRoles > 0) {
      console.log('Los roles ya existen en la base de datos');
      return;
    }

    // Crear roles iniciales
    const roles = [
      {
        nombre: 'ADMIN',
        descripcion: 'Administrador del sistema con acceso total',
      },
      {
        nombre: 'VETERINARIO',
        descripcion: 'Veterinario con acceso a servicios médicos',
      },
      {
        nombre: 'USUARIO',
        descripcion: 'Usuario regular del sistema',
      },
    ];

    for (const roleData of roles) {
      const role = this.rolesRepository.create(roleData);
      await this.rolesRepository.save(role);
    }

    console.log('Roles iniciales creados exitosamente');
  }
}
