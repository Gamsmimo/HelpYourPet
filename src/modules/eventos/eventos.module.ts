import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosController } from './controllers/eventos.controller';
import { EventosService } from './services/eventos.service';
import { Evento } from './entities/evento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evento])],
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosService, TypeOrmModule],
})
export class EventosModule {}


