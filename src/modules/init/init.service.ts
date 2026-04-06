import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../roles/entities/rol.entity';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
  ) {}

  async onModuleInit() {
    await this.createInitialRoles();
  }

  private async createInitialRoles() {
    const count = await this.rolesRepository.count();
    
    if (count === 0) {
      console.log('Creando roles iniciales...');
      
      // Crear roles con IDs específicos: 1=ADMIN, 2=VETERINARIO, 3=USUARIO
      await this.rolesRepository.query(`
        INSERT INTO rol (id, nombre, descripcion) VALUES
        (1, 'ADMIN', 'Administrador del sistema'),
        (2, 'VETERINARIO', 'Veterinario'),
        (3, 'USUARIO', 'Usuario regular')
        ON DUPLICATE KEY UPDATE
        nombre = VALUES(nombre),
        descripcion = VALUES(descripcion)
      `);

      console.log('Roles iniciales creados: 1=ADMIN, 2=VETERINARIO, 3=USUARIO');
    }
  }
}
