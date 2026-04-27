import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiciosController } from './controllers/servicios.controller';
import { ServiciosService } from './services/servicios.service';
import { Servicio } from './entities/servicio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio])],
  controllers: [ServiciosController],
  providers: [ServiciosService],
  exports: [ServiciosService, TypeOrmModule],
})
export class ServiciosModule {}


