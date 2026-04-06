import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsEnum } from 'class-validator';
import { EstadoCarrito } from '../entities/carrito.entity';

export class CreateCarritoDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ description: 'Estado del carrito', enum: EstadoCarrito, example: 'ACTIVO', required: false })
  @IsOptional()
  @IsEnum(EstadoCarrito)
  estado?: EstadoCarrito;
}
