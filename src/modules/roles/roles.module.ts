import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolesManagementService } from './roles-management.service';
import { RolesManagementController } from './roles-management.controller';
import { RoleSeed } from './seeds/role.seed';
import { Rol } from './entities/rol.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PerfilVeterinario } from '../perfil-veterinario/entities/perfil-veterinario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rol, PerfilVeterinario]), UsuariosModule],
  controllers: [RolesController, RolesManagementController],
  providers: [RolesService, RolesManagementService, RoleSeed],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
