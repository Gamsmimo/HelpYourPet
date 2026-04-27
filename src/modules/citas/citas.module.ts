import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasController } from './controllers/citas.controller';
import { CitasService } from './services/citas.service';
import { Cita } from './entities/cita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cita])],
  controllers: [CitasController],
  providers: [CitasService],
  exports: [CitasService, TypeOrmModule],
})
export class CitasModule {}


