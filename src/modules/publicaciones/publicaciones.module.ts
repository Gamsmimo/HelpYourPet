import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';
import { Publicacion } from './entities/publicacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publicacion])],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  exports: [PublicacionesService, TypeOrmModule],
})
export class PublicacionesModule {}
