import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicacionesController } from './controllers/publicaciones.controller';
import { PublicacionesService } from './services/publicaciones.service';
import { Publicacion } from './entities/publicacion.entity';
import { Comentario } from './entities/comentario.entity';
import { Reaccion } from './entities/reaccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publicacion, Comentario, Reaccion])],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  exports: [PublicacionesService, TypeOrmModule],
})
export class PublicacionesModule {}

