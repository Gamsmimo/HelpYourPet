import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVentaController } from './controllers/detalle-venta.controller';
import { DetalleVentaService } from './services/detalle-venta.service';
import { DetalleVenta } from './entities/detalle-venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleVenta])],
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService],
  exports: [DetalleVentaService, TypeOrmModule],
})
export class DetalleVentaModule {}


