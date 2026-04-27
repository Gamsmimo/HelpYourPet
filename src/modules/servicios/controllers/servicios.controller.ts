import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ServiciosService } from '../services/servicios.service';
import { CreateServicioDto } from '../dto/create-servicio.dto';
import { UpdateServicioDto } from '../dto/update-servicio.dto';
import { Servicio } from '../entities/servicio.entity';

@ApiTags('servicios')
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo servicio' })
  @ApiResponse({ status: 201, description: 'Servicio creado', type: Servicio })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.serviciosService.create(createServicioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los servicios' })
  @ApiResponse({ status: 200, description: 'Lista de servicios', type: [Servicio] })
  findAll() {
    return this.serviciosService.findAll();
  }

  @Get('veterinaria/:idVeterinaria')
  @ApiOperation({ summary: 'Listar servicios de una veterinaria' })
  @ApiResponse({ status: 200, description: 'Lista de servicios filtrados', type: [Servicio] })
  findByVeterinaria(@Param('idVeterinaria', ParseIntPipe) idVeterinaria: number) {
    return this.serviciosService.findByVeterinaria(idVeterinaria);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener servicio por ID' })
  @ApiResponse({ status: 200, description: 'Servicio encontrado', type: Servicio })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar servicio' })
  @ApiResponse({ status: 200, description: 'Servicio actualizado', type: Servicio })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateServicioDto: UpdateServicioDto) {
    return this.serviciosService.update(id, updateServicioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar servicio' })
  @ApiResponse({ status: 200, description: 'Servicio eliminado' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.remove(id);
  }
}



