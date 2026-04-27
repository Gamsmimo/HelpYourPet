import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilVeterinarioController } from './controllers/perfil-veterinario.controller';
import { PerfilVeterinarioService } from './services/perfil-veterinario.service';
import { PerfilVeterinario } from './entities/perfil-veterinario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilVeterinario])],
  controllers: [PerfilVeterinarioController],
  providers: [PerfilVeterinarioService],
  exports: [PerfilVeterinarioService, TypeOrmModule],
})
export class PerfilVeterinarioModule {}


