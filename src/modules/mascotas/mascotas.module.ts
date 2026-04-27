import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotasController } from './controllers/mascotas.controller';
import { MascotasService } from './services/mascotas.service';
import { Mascota } from './entities/mascota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mascota])],
  controllers: [MascotasController],
  providers: [MascotasService],
  exports: [MascotasService, TypeOrmModule],
})
export class MascotasModule {}

