import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportesMaltratoService } from './reportes-maltrato.service';
import { CreateReporteMaltratoDto } from './dto/create-reporte-maltrato.dto';
import { UpdateReporteMaltratoDto } from './dto/update-reporte-maltrato.dto';
import { ReporteMaltrato } from './entities/reporte-maltrato.entity';

@ApiTags('reportes-maltrato')
@Controller('reportes-maltrato')
export class ReportesMaltratoController {
  constructor(private readonly reportesMaltratoService: ReportesMaltratoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear reporte de maltrato' })
  @ApiResponse({ status: 201, description: 'Reporte creado', type: ReporteMaltrato })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createReporteMaltratoDto: CreateReporteMaltratoDto) {
    return this.reportesMaltratoService.create(createReporteMaltratoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los reportes' })
  @ApiResponse({ status: 200, description: 'Lista de reportes', type: [ReporteMaltrato] })
  findAll() {
    return this.reportesMaltratoService.findAll();
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Listar reportes por estado' })
  @ApiResponse({ status: 200, description: 'Lista de reportes filtrados', type: [ReporteMaltrato] })
  findByEstado(@Param('estado') estado: string) {
    return this.reportesMaltratoService.findByEstado(estado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reporte por ID' })
  @ApiResponse({ status: 200, description: 'Reporte encontrado', type: ReporteMaltrato })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportesMaltratoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar reporte' })
  @ApiResponse({ status: 200, description: 'Reporte actualizado', type: ReporteMaltrato })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReporteMaltratoDto: UpdateReporteMaltratoDto) {
    return this.reportesMaltratoService.update(id, updateReporteMaltratoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reporte' })
  @ApiResponse({ status: 200, description: 'Reporte eliminado' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportesMaltratoService.remove(id);
  }
}
