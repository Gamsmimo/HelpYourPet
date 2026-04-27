import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasController } from './controllers/ventas.controller';
import { VentasService } from './services/ventas.service';
import { Venta } from './entities/venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta])],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService, TypeOrmModule],
})
export class VentasModule {}


