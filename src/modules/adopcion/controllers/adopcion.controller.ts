import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdopcionService } from '../services/adopcion.service';
import { CreateAdopcionDto } from '../dto/create-adopcion.dto';
import { UpdateAdopcionDto } from '../dto/update-adopcion.dto';
import { Adopcion } from '../entities/adopcion.entity';

@ApiTags('adopcion')
@Controller('adopcion')
export class AdopcionController {
  constructor(private readonly adopcionService: AdopcionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva adopciÃ³n' })
  @ApiResponse({ status: 201, description: 'AdopciÃ³n creada', type: Adopcion })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createAdopcionDto: CreateAdopcionDto) {
    return this.adopcionService.create(createAdopcionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las adopciones' })
  @ApiResponse({ status: 200, description: 'Lista de adopciones', type: [Adopcion] })
  findAll() {
    return this.adopcionService.findAll();
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Listar adopciones por estado' })
  @ApiResponse({ status: 200, description: 'Lista de adopciones filtradas', type: [Adopcion] })
  findByEstado(@Param('estado') estado: string) {
    return this.adopcionService.findByEstado(estado);
  }

  @Get('usuario/:idUsuario')
  @ApiOperation({ summary: 'Obtener adopciones publicadas por un usuario' })
  @ApiResponse({ status: 200, description: 'Lista de adopciones del usuario', type: [Adopcion] })
  @ApiBearerAuth('JWT-auth')
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.adopcionService.findByUsuario(idUsuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener adopciÃ³n por ID' })
  @ApiResponse({ status: 200, description: 'AdopciÃ³n encontrada', type: Adopcion })
  @ApiResponse({ status: 404, description: 'AdopciÃ³n no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adopcionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar adopciÃ³n' })
  @ApiResponse({ status: 200, description: 'AdopciÃ³n actualizada', type: Adopcion })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAdopcionDto: UpdateAdopcionDto) {
    return this.adopcionService.update(id, updateAdopcionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar adopciÃ³n' })
  @ApiResponse({ status: 200, description: 'AdopciÃ³n eliminada' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adopcionService.remove(id);
  }
}


