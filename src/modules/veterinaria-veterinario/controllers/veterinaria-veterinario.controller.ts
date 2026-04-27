import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VeterinariaVeterinarioService } from '../services/veterinaria-veterinario.service';
import { CreateVeterinariaVeterinarioDto } from '../dto/create-veterinaria-veterinario.dto';
import { UpdateVeterinariaVeterinarioDto } from '../dto/update-veterinaria-veterinario.dto';
import { VeterinariaVeterinario } from '../entities/veterinaria-veterinario.entity';

@ApiTags('veterinaria-veterinario')
@Controller('veterinaria-veterinario')
export class VeterinariaVeterinarioController {
  constructor(private readonly veterinariaVeterinarioService: VeterinariaVeterinarioService) {}

  @Post()
  @ApiOperation({ summary: 'Asignar veterinario a veterinaria' })
  @ApiResponse({ status: 201, description: 'AsignaciÃ³n creada', type: VeterinariaVeterinario })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createVeterinariaVeterinarioDto: CreateVeterinariaVeterinarioDto) {
    return this.veterinariaVeterinarioService.create(createVeterinariaVeterinarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las asignaciones' })
  @ApiResponse({ status: 200, description: 'Lista de asignaciones', type: [VeterinariaVeterinario] })
  findAll() {
    return this.veterinariaVeterinarioService.findAll();
  }

  @Get('veterinaria/:idVeterinaria')
  @ApiOperation({ summary: 'Listar veterinarios de una veterinaria' })
  @ApiResponse({ status: 200, description: 'Lista de asignaciones filtradas', type: [VeterinariaVeterinario] })
  findByVeterinaria(@Param('idVeterinaria', ParseIntPipe) idVeterinaria: number) {
    return this.veterinariaVeterinarioService.findByVeterinaria(idVeterinaria);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener asignaciÃ³n por ID' })
  @ApiResponse({ status: 200, description: 'AsignaciÃ³n encontrada', type: VeterinariaVeterinario })
  @ApiResponse({ status: 404, description: 'AsignaciÃ³n no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.veterinariaVeterinarioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar asignaciÃ³n' })
  @ApiResponse({ status: 200, description: 'AsignaciÃ³n actualizada', type: VeterinariaVeterinario })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVeterinariaVeterinarioDto: UpdateVeterinariaVeterinarioDto) {
    return this.veterinariaVeterinarioService.update(id, updateVeterinariaVeterinarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar asignaciÃ³n' })
  @ApiResponse({ status: 200, description: 'AsignaciÃ³n eliminada' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.veterinariaVeterinarioService.remove(id);
  }
}



