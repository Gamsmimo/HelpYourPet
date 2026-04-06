import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmergenciasService } from './emergencias.service';
import { CreateEmergenciaDto } from './dto/create-emergencia.dto';
import { UpdateEmergenciaDto } from './dto/update-emergencia.dto';
import { Emergencia } from './entities/emergencia.entity';

@ApiTags('emergencias')
@Controller('emergencias')
export class EmergenciasController {
  constructor(private readonly emergenciasService: EmergenciasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva emergencia' })
  @ApiResponse({ status: 201, description: 'Emergencia creada', type: Emergencia })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createEmergenciaDto: CreateEmergenciaDto) {
    return this.emergenciasService.create(createEmergenciaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las emergencias' })
  @ApiResponse({ status: 200, description: 'Lista de emergencias', type: [Emergencia] })
  findAll() {
    return this.emergenciasService.findAll();
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Listar emergencias por estado' })
  @ApiResponse({ status: 200, description: 'Lista de emergencias filtradas', type: [Emergencia] })
  findByEstado(@Param('estado') estado: string) {
    return this.emergenciasService.findByEstado(estado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener emergencia por ID' })
  @ApiResponse({ status: 200, description: 'Emergencia encontrada', type: Emergencia })
  @ApiResponse({ status: 404, description: 'Emergencia no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.emergenciasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar emergencia' })
  @ApiResponse({ status: 200, description: 'Emergencia actualizada', type: Emergencia })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEmergenciaDto: UpdateEmergenciaDto) {
    return this.emergenciasService.update(id, updateEmergenciaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar emergencia' })
  @ApiResponse({ status: 200, description: 'Emergencia eliminada' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.emergenciasService.remove(id);
  }
}
