import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoController } from './controllers/carrito.controller';
import { CarritoService } from './services/carrito.service';
import { Carrito } from './entities/carrito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrito])],
  controllers: [CarritoController],
  providers: [CarritoService],
  exports: [CarritoService, TypeOrmModule],
})
export class CarritoModule {}


