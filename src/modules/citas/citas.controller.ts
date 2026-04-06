import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { Cita } from './entities/cita.entity';

@ApiTags('citas')
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva cita' })
  @ApiResponse({ status: 201, description: 'Cita creada', type: Cita })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las citas' })
  @ApiResponse({ status: 200, description: 'Lista de citas', type: [Cita] })
  findAll() {
    return this.citasService.findAll();
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Listar citas por estado' })
  @ApiResponse({ status: 200, description: 'Lista de citas filtradas', type: [Cita] })
  findByEstado(@Param('estado') estado: string) {
    return this.citasService.findByEstado(estado);
  }

  @Get('usuario/:idUsuario')
  @ApiOperation({ summary: 'Listar citas de un usuario' })
  @ApiResponse({ status: 200, description: 'Lista de citas del usuario', type: [Cita] })
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.citasService.findByUsuario(idUsuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cita por ID' })
  @ApiResponse({ status: 200, description: 'Cita encontrada', type: Cita })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar cita' })
  @ApiResponse({ status: 200, description: 'Cita actualizada', type: Cita })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(id, updateCitaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar cita' })
  @ApiResponse({ status: 200, description: 'Cita eliminada' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.remove(id);
  }
}
