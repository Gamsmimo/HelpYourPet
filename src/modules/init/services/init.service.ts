import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../../roles/entities/rol.entity';

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
    try {
      const count = await this.rolesRepository.count();
      
      if (count === 0) {
        console.log('Creando roles iniciales...');
        
        // Crear roles con IDs especÃ­ficos: 1=ADMIN, 2=VETERINARIO, 3=USUARIO
        // Usando sintaxis de PostgreSQL (ON CONFLICT en lugar de ON DUPLICATE KEY)
        await this.rolesRepository.query(`
          INSERT INTO rol (id_rol, nombre_rol, descripcion) VALUES
          (1, 'ADMIN', 'Administrador del sistema'),
          (2, 'VETERINARIO', 'Veterinario'),
          (3, 'USUARIO', 'Usuario regular')
          ON CONFLICT (id_rol) DO UPDATE SET
          nombre_rol = EXCLUDED.nombre_rol,
          descripcion = EXCLUDED.descripcion
        `);

        console.log('Roles iniciales creados: 1=ADMIN, 2=VETERINARIO, 3=USUARIO');
      }
    } catch (error) {
      console.error('Error al crear roles iniciales:', error.message);
      // No lanzar el error para permitir que la aplicaciÃ³n continÃºe
    }
  }
}

