import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { Carrito } from './entities/carrito.entity';

@ApiTags('carrito')
@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo carrito' })
  @ApiResponse({ status: 201, description: 'Carrito creado', type: Carrito })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createCarritoDto: CreateCarritoDto) {
    return this.carritoService.create(createCarritoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los carritos' })
  @ApiResponse({ status: 200, description: 'Lista de carritos', type: [Carrito] })
  findAll() {
    return this.carritoService.findAll();
  }

  @Get('usuario/:idUsuario')
  @ApiOperation({ summary: 'Listar carritos de un usuario' })
  @ApiResponse({ status: 200, description: 'Lista de carritos filtrados', type: [Carrito] })
  findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.carritoService.findByUsuario(idUsuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener carrito por ID' })
  @ApiResponse({ status: 200, description: 'Carrito encontrado', type: Carrito })
  @ApiResponse({ status: 404, description: 'Carrito no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carritoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar carrito' })
  @ApiResponse({ status: 200, description: 'Carrito actualizado', type: Carrito })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCarritoDto: UpdateCarritoDto) {
    return this.carritoService.update(id, updateCarritoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar carrito' })
  @ApiResponse({ status: 200, description: 'Carrito eliminado' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carritoService.remove(id);
  }
}
