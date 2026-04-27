import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionesController } from './controllers/calificaciones.controller';
import { CalificacionesService } from './services/calificaciones.service';
import { Calificacion } from './entities/calificacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calificacion])],
  controllers: [CalificacionesController],
  providers: [CalificacionesService],
  exports: [CalificacionesService, TypeOrmModule],
})
export class CalificacionesModule {}


