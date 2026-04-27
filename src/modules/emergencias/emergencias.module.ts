import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergenciasController } from './controllers/emergencias.controller';
import { EmergenciasService } from './services/emergencias.service';
import { Emergencia } from './entities/emergencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Emergencia])],
  controllers: [EmergenciasController],
  providers: [EmergenciasService],
  exports: [EmergenciasService, TypeOrmModule],
})
export class EmergenciasModule {}


