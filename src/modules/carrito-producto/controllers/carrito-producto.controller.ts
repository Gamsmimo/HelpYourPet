import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CarritoProductoService } from '../services/carrito-producto.service';
import { CreateCarritoProductoDto } from '../dto/create-carrito-producto.dto';
import { UpdateCarritoProductoDto } from '../dto/update-carrito-producto.dto';
import { CarritoProducto } from '../entities/carrito-producto.entity';

@ApiTags('carrito-producto')
@Controller('carrito-producto')
export class CarritoProductoController {
  constructor(private readonly carritoProductoService: CarritoProductoService) {}

  @Post()
  @ApiOperation({ summary: 'Agregar producto al carrito' })
  @ApiResponse({ status: 201, description: 'Producto agregado', type: CarritoProducto })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createCarritoProductoDto: CreateCarritoProductoDto) {
    return this.carritoProductoService.create(createCarritoProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los items' })
  @ApiResponse({ status: 200, description: 'Lista de items', type: [CarritoProducto] })
  findAll() {
    return this.carritoProductoService.findAll();
  }

  @Get('carrito/:idCarrito')
  @ApiOperation({ summary: 'Listar items de un carrito' })
  @ApiResponse({ status: 200, description: 'Lista de items filtrados', type: [CarritoProducto] })
  findByCarrito(@Param('idCarrito', ParseIntPipe) idCarrito: number) {
    return this.carritoProductoService.findByCarrito(idCarrito);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener item por ID' })
  @ApiResponse({ status: 200, description: 'Item encontrado', type: CarritoProducto })
  @ApiResponse({ status: 404, description: 'Item no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carritoProductoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar item' })
  @ApiResponse({ status: 200, description: 'Item actualizado', type: CarritoProducto })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCarritoProductoDto: UpdateCarritoProductoDto) {
    return this.carritoProductoService.update(id, updateCarritoProductoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar item del carrito' })
  @ApiResponse({ status: 200, description: 'Item eliminado' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carritoProductoService.remove(id);
  }
}



