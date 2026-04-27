import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeterinariasController } from './controllers/veterinarias.controller';
import { VeterinariasService } from './services/veterinarias.service';
import { Veterinaria } from './entities/veterinaria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Veterinaria])],
  controllers: [VeterinariasController],
  providers: [VeterinariasService],
  exports: [VeterinariasService, TypeOrmModule],
})
export class VeterinariasModule {}


