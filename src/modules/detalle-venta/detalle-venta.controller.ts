import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DetalleVentaService } from './detalle-venta.service';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';
import { DetalleVenta } from './entities/detalle-venta.entity';

@ApiTags('detalle-venta')
@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear detalle de venta' })
  @ApiResponse({ status: 201, description: 'Detalle creado', type: DetalleVenta })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createDetalleVentaDto: CreateDetalleVentaDto) {
    return this.detalleVentaService.create(createDetalleVentaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los detalles' })
  @ApiResponse({ status: 200, description: 'Lista de detalles', type: [DetalleVenta] })
  findAll() {
    return this.detalleVentaService.findAll();
  }

  @Get('venta/:idVenta')
  @ApiOperation({ summary: 'Listar detalles de una venta' })
  @ApiResponse({ status: 200, description: 'Lista de detalles filtrados', type: [DetalleVenta] })
  findByVenta(@Param('idVenta', ParseIntPipe) idVenta: number) {
    return this.detalleVentaService.findByVenta(idVenta);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle por ID' })
  @ApiResponse({ status: 200, description: 'Detalle encontrado', type: DetalleVenta })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleVentaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar detalle' })
  @ApiResponse({ status: 200, description: 'Detalle actualizado', type: DetalleVenta })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDetalleVentaDto: UpdateDetalleVentaDto) {
    return this.detalleVentaService.update(id, updateDetalleVentaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar detalle' })
  @ApiResponse({ status: 200, description: 'Detalle eliminado' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.detalleVentaService.remove(id);
  }
}
