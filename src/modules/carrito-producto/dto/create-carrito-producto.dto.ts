import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateCarritoProductoDto {
  @ApiProperty({ description: 'Cantidad del producto', example: 2 })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ description: 'Precio unitario', example: 50000 })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({ description: 'ID del carrito' })
  @IsInt()
  idCarrito: number;

  @ApiProperty({ description: 'ID del producto' })
  @IsInt()
  idProducto: number;
}
