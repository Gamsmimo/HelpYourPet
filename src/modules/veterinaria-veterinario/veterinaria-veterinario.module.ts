import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeterinariaVeterinarioController } from './controllers/veterinaria-veterinario.controller';
import { VeterinariaVeterinarioService } from './services/veterinaria-veterinario.service';
import { VeterinariaVeterinario } from './entities/veterinaria-veterinario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VeterinariaVeterinario])],
  controllers: [VeterinariaVeterinarioController],
  providers: [VeterinariaVeterinarioService],
  exports: [VeterinariaVeterinarioService, TypeOrmModule],
})
export class VeterinariaVeterinarioModule {}


