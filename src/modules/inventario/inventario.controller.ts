import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { Inventario } from './entities/inventario.entity';

@ApiTags('inventario')
@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro de inventario' })
  @ApiResponse({ status: 201, description: 'Inventario creado', type: Inventario })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventarioService.create(createInventarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todo el inventario' })
  @ApiResponse({ status: 200, description: 'Lista de inventario', type: [Inventario] })
  findAll() {
    return this.inventarioService.findAll();
  }

  @Get('veterinaria/:idVeterinaria')
  @ApiOperation({ summary: 'Listar inventario de una veterinaria' })
  @ApiResponse({ status: 200, description: 'Lista de inventario filtrado', type: [Inventario] })
  findByVeterinaria(@Param('idVeterinaria', ParseIntPipe) idVeterinaria: number) {
    return this.inventarioService.findByVeterinaria(idVeterinaria);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener inventario por ID' })
  @ApiResponse({ status: 200, description: 'Inventario encontrado', type: Inventario })
  @ApiResponse({ status: 404, description: 'Inventario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar inventario' })
  @ApiResponse({ status: 200, description: 'Inventario actualizado', type: Inventario })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateInventarioDto: UpdateInventarioDto) {
    return this.inventarioService.update(id, updateInventarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar inventario' })
  @ApiResponse({ status: 200, description: 'Inventario eliminado' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.remove(id);
  }
}
