import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { Calificacion } from './entities/calificacion.entity';

@ApiTags('calificaciones')
@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly calificacionesService: CalificacionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva calificación' })
  @ApiResponse({ status: 201, description: 'Calificación creada', type: Calificacion })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createCalificacionDto: CreateCalificacionDto) {
    return this.calificacionesService.create(createCalificacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las calificaciones' })
  @ApiResponse({ status: 200, description: 'Lista de calificaciones', type: [Calificacion] })
  findAll() {
    return this.calificacionesService.findAll();
  }

  @Get('servicio/:idServicio')
  @ApiOperation({ summary: 'Listar calificaciones de un servicio' })
  @ApiResponse({ status: 200, description: 'Lista de calificaciones filtradas', type: [Calificacion] })
  findByServicio(@Param('idServicio', ParseIntPipe) idServicio: number) {
    return this.calificacionesService.findByServicio(idServicio);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener calificación por ID' })
  @ApiResponse({ status: 200, description: 'Calificación encontrada', type: Calificacion })
  @ApiResponse({ status: 404, description: 'Calificación no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.calificacionesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar calificación' })
  @ApiResponse({ status: 200, description: 'Calificación actualizada', type: Calificacion })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCalificacionDto: UpdateCalificacionDto) {
    return this.calificacionesService.update(id, updateCalificacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar calificación' })
  @ApiResponse({ status: 200, description: 'Calificación eliminada' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.calificacionesService.remove(id);
  }
}
