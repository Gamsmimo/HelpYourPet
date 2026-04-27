import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EventosService } from '../services/eventos.service';
import { CreateEventoDto } from '../dto/create-evento.dto';
import { UpdateEventoDto } from '../dto/update-evento.dto';
import { Evento } from '../entities/evento.entity';

@ApiTags('eventos')
@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo evento' })
  @ApiResponse({ status: 201, description: 'Evento creado', type: Evento })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createEventoDto: CreateEventoDto) {
    return this.eventosService.create(createEventoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los eventos' })
  @ApiResponse({ status: 200, description: 'Lista de eventos', type: [Evento] })
  findAll() {
    return this.eventosService.findAll();
  }

  @Get('veterinaria/:idVeterinaria')
  @ApiOperation({ summary: 'Listar eventos de una veterinaria' })
  @ApiResponse({ status: 200, description: 'Lista de eventos filtrados', type: [Evento] })
  findByVeterinaria(@Param('idVeterinaria', ParseIntPipe) idVeterinaria: number) {
    return this.eventosService.findByVeterinaria(idVeterinaria);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener evento por ID' })
  @ApiResponse({ status: 200, description: 'Evento encontrado', type: Evento })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar evento' })
  @ApiResponse({ status: 200, description: 'Evento actualizado', type: Evento })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEventoDto: UpdateEventoDto) {
    return this.eventosService.update(id, updateEventoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar evento' })
  @ApiResponse({ status: 200, description: 'Evento eliminado' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.remove(id);
  }
}



