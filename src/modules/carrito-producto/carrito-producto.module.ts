import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoProductoController } from './carrito-producto.controller';
import { CarritoProductoService } from './carrito-producto.service';
import { CarritoProducto } from './entities/carrito-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarritoProducto])],
  controllers: [CarritoProductoController],
  providers: [CarritoProductoService],
  exports: [CarritoProductoService, TypeOrmModule],
})
export class CarritoProductoModule {}
