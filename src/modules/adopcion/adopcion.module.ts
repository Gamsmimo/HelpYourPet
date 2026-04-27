import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdopcionController } from './controllers/adopcion.controller';
import { AdopcionService } from './services/adopcion.service';
import { Adopcion } from './entities/adopcion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Adopcion])],
  controllers: [AdopcionController],
  providers: [AdopcionService],
  exports: [AdopcionService, TypeOrmModule],
})
export class AdopcionModule {}

