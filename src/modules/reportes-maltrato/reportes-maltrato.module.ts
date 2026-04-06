import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesMaltratoController } from './reportes-maltrato.controller';
import { ReportesMaltratoService } from './reportes-maltrato.service';
import { ReporteMaltrato } from './entities/reporte-maltrato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReporteMaltrato])],
  controllers: [ReportesMaltratoController],
  providers: [ReportesMaltratoService],
  exports: [ReportesMaltratoService, TypeOrmModule],
})
export class ReportesMaltratoModule {}
