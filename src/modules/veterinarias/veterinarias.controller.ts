import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VeterinariasService } from './veterinarias.service';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
import { Veterinaria } from './entities/veterinaria.entity';

@ApiTags('veterinarias')
@Controller('veterinarias')
export class VeterinariasController {
  constructor(private readonly veterinariasService: VeterinariasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva veterinaria' })
  @ApiResponse({ status: 201, description: 'Veterinaria creada', type: Veterinaria })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createVeterinariaDto: CreateVeterinariaDto) {
    return this.veterinariasService.create(createVeterinariaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las veterinarias' })
  @ApiResponse({ status: 200, description: 'Lista de veterinarias', type: [Veterinaria] })
  findAll() {
    return this.veterinariasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener veterinaria por ID' })
  @ApiResponse({ status: 200, description: 'Veterinaria encontrada', type: Veterinaria })
  @ApiResponse({ status: 404, description: 'Veterinaria no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.veterinariasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar veterinaria' })
  @ApiResponse({ status: 200, description: 'Veterinaria actualizada', type: Veterinaria })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVeterinariaDto: UpdateVeterinariaDto) {
    return this.veterinariasService.update(id, updateVeterinariaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar veterinaria' })
  @ApiResponse({ status: 200, description: 'Veterinaria eliminada' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.veterinariasService.remove(id);
  }
}
