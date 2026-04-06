import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HistoriasClinicasService } from './historias-clinicas.service';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';
import { HistoriaClinica } from './entities/historia-clinica.entity';

@ApiTags('historias-clinicas')
@Controller('historias-clinicas')
export class HistoriasClinicasController {
  constructor(private readonly historiasClinicasService: HistoriasClinicasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva historia clínica' })
  @ApiResponse({ status: 201, description: 'Historia clínica creada', type: HistoriaClinica })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createHistoriaClinicaDto: CreateHistoriaClinicaDto) {
    return this.historiasClinicasService.create(createHistoriaClinicaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las historias clínicas' })
  @ApiResponse({ status: 200, description: 'Lista de historias clínicas', type: [HistoriaClinica] })
  findAll() {
    return this.historiasClinicasService.findAll();
  }

  @Get('mascota/:idMascota')
  @ApiOperation({ summary: 'Listar historias clínicas de una mascota' })
  @ApiResponse({ status: 200, description: 'Lista de historias clínicas filtradas', type: [HistoriaClinica] })
  findByMascota(@Param('idMascota', ParseIntPipe) idMascota: number) {
    return this.historiasClinicasService.findByMascota(idMascota);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener historia clínica por ID' })
  @ApiResponse({ status: 200, description: 'Historia clínica encontrada', type: HistoriaClinica })
  @ApiResponse({ status: 404, description: 'Historia clínica no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.historiasClinicasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar historia clínica' })
  @ApiResponse({ status: 200, description: 'Historia clínica actualizada', type: HistoriaClinica })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateHistoriaClinicaDto: UpdateHistoriaClinicaDto) {
    return this.historiasClinicasService.update(id, updateHistoriaClinicaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar historia clínica' })
  @ApiResponse({ status: 200, description: 'Historia clínica eliminada' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.historiasClinicasService.remove(id);
  }
}
