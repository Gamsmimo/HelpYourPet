import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioController } from './controllers/inventario.controller';
import { InventarioService } from './services/inventario.service';
import { Inventario } from './entities/inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventario])],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [InventarioService, TypeOrmModule],
})
export class InventarioModule {}


