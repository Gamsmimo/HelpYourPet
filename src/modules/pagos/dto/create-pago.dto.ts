import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsOptional, IsDateString, Min } from 'class-validator';

export class CreatePagoDto {
  @ApiProperty({ description: 'Monto del pago', example: 150000 })
  @IsNumber()
  @Min(0)
  monto: number;

  @ApiProperty({ description: 'Método de pago', example: 'Tarjeta de crédito' })
  @IsString()
  metodoPago: string;

  @ApiProperty({ description: 'Fecha del pago', required: false })
  @IsOptional()
  @IsDateString()
  fecha?: Date;

  @ApiProperty({ description: 'ID de la venta' })
  @IsInt()
  idVenta: number;
}
