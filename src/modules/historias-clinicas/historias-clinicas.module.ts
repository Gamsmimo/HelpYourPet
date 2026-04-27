import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriasClinicasController } from './controllers/historias-clinicas.controller';
import { HistoriasClinicasService } from './services/historias-clinicas.service';
import { HistoriaClinica } from './entities/historia-clinica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoriaClinica])],
  controllers: [HistoriasClinicasController],
  providers: [HistoriasClinicasService],
  exports: [HistoriasClinicasService, TypeOrmModule],
})
export class HistoriasClinicasModule {}


