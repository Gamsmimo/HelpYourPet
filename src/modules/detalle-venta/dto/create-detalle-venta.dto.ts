import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateDetalleVentaDto {
  @ApiProperty({ description: 'Cantidad del producto', example: 2 })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ description: 'Precio unitario', example: 50000 })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({ description: 'Subtotal', example: 100000 })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ description: 'ID del producto' })
  @IsInt()
  idProducto: number;

  @ApiProperty({ description: 'ID de la venta' })
  @IsInt()
  idVenta: number;
}
