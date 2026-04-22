import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago } from './entities/pago.entity';
import { CreateStripeCheckoutDto } from './dto/create-stripe-checkout.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo pago' })
  @ApiResponse({ status: 201, description: 'Pago creado', type: Pago })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagosService.create(createPagoDto);
  }

  @Post('stripe/checkout-session')
  @Public()
  @ApiOperation({ summary: 'Crear sesión de pago en Stripe (modo prueba)' })
  @ApiResponse({ status: 201, description: 'Sesión de Stripe creada' })
  createStripeCheckoutSession(@Body() dto: CreateStripeCheckoutDto) {
    return this.pagosService.createStripeCheckoutSession(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los pagos' })
  @ApiResponse({ status: 200, description: 'Lista de pagos', type: [Pago] })
  findAll() {
    return this.pagosService.findAll();
  }

  @Get('venta/:idVenta')
  @ApiOperation({ summary: 'Listar pagos de una venta' })
  @ApiResponse({ status: 200, description: 'Lista de pagos filtrados', type: [Pago] })
  findByVenta(@Param('idVenta', ParseIntPipe) idVenta: number) {
    return this.pagosService.findByVenta(idVenta);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pago por ID' })
  @ApiResponse({ status: 200, description: 'Pago encontrado', type: Pago })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar pago' })
  @ApiResponse({ status: 200, description: 'Pago actualizado', type: Pago })
  @ApiBearerAuth('JWT-auth')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagosService.update(id, updatePagoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar pago' })
  @ApiResponse({ status: 200, description: 'Pago eliminado' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pagosService.remove(id);
  }
}
