import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificacionesService } from '../services/notificaciones.service';
import { CreateNotificacionDto } from '../dto/create-notificacion.dto';
import { UpdateNotificacionDto } from '../dto/update-notificacion.dto';
import { Notificacion } from '../entities/notificacion.entity';

@ApiTags('notificaciones')
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva notificaciÃ³n' })
  @ApiResponse({ status: 201, description: 'NotificaciÃ³n creada', type: Notificacion })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createNotificacionDto: CreateNotificacionDto) {
    return this.notificacionesService.create(createNotificacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las notificaciones' })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones', type: [Notificacion] })
  findAll() {
    return this.notificacionesService.findAll();
  }

  @Get('usuario/:idUsuario')
  @ApiOperation({ summary: 'Listar notificaciones de un usuario' })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones filtradas', type: [Notificacion] })
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.notificacionesService.findByUsuario(idUsuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener notificaciÃ³n por ID' })
  @ApiResponse({ status: 200, description: 'NotificaciÃ³n encontrada', type: Notificacion })
  @ApiResponse({ status: 404, description: 'NotificaciÃ³n no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificacionesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar notificaciÃ³n' })
  @ApiResponse({ status: 200, description: 'NotificaciÃ³n actualizada', type: Notificacion })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNotificacionDto: UpdateNotificacionDto) {
    return this.notificacionesService.update(id, updateNotificacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar notificaciÃ³n' })
  @ApiResponse({ status: 200, description: 'NotificaciÃ³n eliminada' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notificacionesService.remove(id);
  }
}



